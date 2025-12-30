import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Axios } from 'axios'
import { stringify } from 'querystring'
import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI,
  SPOTIFY_SCOPES,
} from 'src/config'
import { Repository } from 'typeorm'
import { CreateSpotifyAccountDto, UpdateSpotifyAccountDto } from './dto/spotify-account.dto'
import { SpotifyTokensDto } from './dto/spotify-tokens.dto'
import { isSpotifyLink, SpotifyAccount } from './entities/spotify-account.entity'
import { SpotifyBaseService } from './spotify-base.service'
import { HttpService } from '@nestjs/axios'

@Injectable()
export class SpotifyAuthService extends SpotifyBaseService {
  constructor(
    @InjectRepository(SpotifyAccount) private repo: Repository<SpotifyAccount>,
    protected httpService: HttpService,
  ) {
    super()
  }

  private async authenticateSpotify(code: string): Promise<SpotifyTokensDto> {
    const body = {
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: SPOTIFY_REDIRECT_URI,
    }
    const authBuffer = Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET)

    const res = await this.httpService.axiosRef
      .post('https://accounts.spotify.com/api/token', body, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Basic ' + authBuffer.toString('base64'),
        },
      })
      .catch((error) => {
        throw new BadRequestException(error?.response?.data?.error_description || error)
      })

    if (res.status > 299 || !res.data) {
      throw new BadRequestException('Unable to authenticate with Spotify')
    }

    const tokens: SpotifyTokensDto = {
      access_token: res.data.access_token,
      expires_in: res.data.expires_in,
      refresh_token: res.data.refresh_token,
      token_type: res.data.token_type,
    }

    return tokens
  }

  public getSpotifyRedirectUri(userId: number, finalRedirect?: string, jukeboxId?: number) {
    const state = JSON.stringify({ userId, finalRedirect, jukeboxId })
    const url =
      'https://accounts.spotify.com/authorize?' +
      stringify({
        response_type: 'code',
        client_id: SPOTIFY_CLIENT_ID,
        scope: SPOTIFY_SCOPES.join(','),
        redirect_uri: SPOTIFY_REDIRECT_URI,
        state: state,
      })

    return url
  }

  public async handleAuthCode(userId: number, code: string) {
    const tokens = await this.authenticateSpotify(code)
    const sdk = this.getSdk(tokens)
    const profile = await sdk.currentUser.profile()

    return await this.updateOrCreateAccount(userId, profile.email, tokens)

    // return profile
  }

  // TODO: Implement not found error, should be implemented in service or controller?
  public async findUserAccounts(userId: number) {
    return await this.repo.findBy({ user_id: userId })
  }

  public async findOneUserAccount(userId: number, spotifyEmail: string) {
    return await this.repo.findOneBy({ user_id: userId, spotify_email: spotifyEmail })
  }

  private async findAccountFromEmail(spotifyEmail: string) {
    return await this.repo.findOneBy({ spotify_email: spotifyEmail })
  }

  public async refreshSpotifyAccount(
    account: { spotify_email: string } | SpotifyAccount,
    force = false,
  ): Promise<SpotifyAccount> {
    let spotifyAccount: SpotifyAccount

    if (!isSpotifyLink(account)) {
      spotifyAccount = (await this.findAccountFromEmail(account.spotify_email)) as SpotifyAccount
    } else {
      spotifyAccount = account
    }

    if (!spotifyAccount.isExpired() && !force) {
      return spotifyAccount
    }

    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: spotifyAccount.refresh_token,
    })
    const authBuffer = Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET)

    const res = await this.httpService.axiosRef
      .post('https://accounts.spotify.com/api/token', body, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Basic ' + authBuffer.toString('base64'),
        },
      })
      .catch((error) => {
        console.log('Error from axios spotify:', error)
        throw new BadRequestException(error?.response?.data?.error_description || error)
      })

    spotifyAccount.access_token = res.data.access_token
    spotifyAccount.expires_in = res.data.expires_in
    spotifyAccount.syncExpiresAt()
    Logger.debug('Refreshed spotify token.')

    await spotifyAccount.save()
    return spotifyAccount
  }

  /**
   * This function was made public for testing purposes and should not be used on its own
   * outside of the normal auth flow in production.
   *
   * handleAuthCode should be used
   * @param createSpotifyLinkDto
   * @returns
   */
  public async addAccount(createSpotifyLinkDto: CreateSpotifyAccountDto) {
    const { user_id: userId, spotify_email: spotifyEmail, tokens } = createSpotifyLinkDto
    const account = this.repo.create({ user_id: userId, spotify_email: spotifyEmail, ...tokens })

    account.syncExpiresAt()
    await this.repo.save(account)

    return account
  }

  private async updateAccount(id: number, updateSpotifyLInkDto: UpdateSpotifyAccountDto) {
    const account = await this.repo.findOneBy({ id })

    if (!account) {
      throw new BadRequestException(`Cannot find preexisting spotify account link with id ${id}`)
    }

    Object.assign(account, updateSpotifyLInkDto)
    await this.repo.save(account)

    return account
  }

  private async updateOrCreateAccount(
    userId: number,
    spotifyEmail: string,
    tokens: SpotifyTokensDto,
  ) {
    const existing = await this.repo.findOneBy({ user_id: userId, spotify_email: spotifyEmail })

    if (!existing) {
      return await this.addAccount({ user_id: userId, spotify_email: spotifyEmail, tokens })
    } else {
      return await this.updateAccount(existing.id, {
        access_token: tokens.access_token,
        expires_in: tokens.expires_in,
      })
    }
  }

  public async removeAccount(id: number) {
    const account = await this.repo.findOneBy({ id })
    await account?.remove() // TODO: Implement Not Found error for account

    return account
  }

  public async getAccountTokens(id: number): Promise<SpotifyTokensDto> {
    let account = await this.repo.findOneBy({ id })
    if (!account) {
      throw new NotFoundException(`Spotify account not found with linked id ${id}.`)
    }
    account = await this.refreshSpotifyAccount(account)

    return {
      access_token: account.access_token,
      expires_in: account.expires_in,
      refresh_token: account.refresh_token,
      token_type: account.token_type,
    }
  }
}
