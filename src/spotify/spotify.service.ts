import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { SpotifyApi } from '@spotify/web-api-ts-sdk'
import { Axios } from 'axios'
import { stringify } from 'querystring'
import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI,
  SPOTIFY_SCOPES,
} from 'src/config'
import { Repository } from 'typeorm'
import { CreateSpotifyLinkDto, UpdateSpotifyLinkDto } from './dto/spotify-link.dto'
import { SpotifyTokensDto } from './dto/spotify-tokens.dto'
import { isSpotifyLink, SpotifyLink } from './entities/spotify-link.entity'

@Injectable()
export class SpotifyService {
  constructor(
    @InjectRepository(SpotifyLink) private repo: Repository<SpotifyLink>,
    protected axios: Axios,
  ) {}

  private getSdk(tokens: SpotifyTokensDto) {
    return SpotifyApi.withAccessToken(SPOTIFY_CLIENT_ID, {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_in: tokens.expires_in,
      token_type: tokens.token_type,
    })
  }

  private async authenticateSpotify(code: string): Promise<SpotifyTokensDto> {
    const body = {
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: SPOTIFY_REDIRECT_URI,
    }
    const authBuffer = Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET)

    const res = await this.axios
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

  public getSpotifyRedirectUri(userId: number, finalRedirect?: string) {
    const state = JSON.stringify({ userId, finalRedirect })
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

    await this.updateOrCreateLink(userId, profile.email, tokens)

    return profile
  }

  // TODO: Implement not found error, should be implemented in service or controller?
  public async findUserLinks(userId: number) {
    return await this.repo.findBy({ user_id: userId })
  }

  public async findOneUserLink(userId: number, spotifyEmail: string) {
    return await this.repo.findOneBy({ user_id: userId, spotify_email: spotifyEmail })
  }

  private async findLinkFromEmail(spotifyEmail: string) {
    return await this.repo.findOneBy({ spotify_email: spotifyEmail })
  }

  public async refreshSpotifyLink(
    link: { spotify_email: string } | SpotifyLink,
  ): Promise<SpotifyLink> {
    let spotifyLink: SpotifyLink
    if (!isSpotifyLink(link)) {
      spotifyLink = (await this.findLinkFromEmail(link.spotify_email)) as SpotifyLink
    } else {
      spotifyLink = link
    }

    const sdk = this.getSdk(spotifyLink)

    const tokens = await sdk.getAccessToken()

    spotifyLink.access_token = tokens.access_token
    spotifyLink.expires_in = tokens.expires_in
    spotifyLink.expires_at = new Date(tokens.expires)

    await spotifyLink.save()
    return spotifyLink
  }

  private async createLink(createSpotifyLinkDto: CreateSpotifyLinkDto) {
    const { user_id: userId, spotify_email: spotifyEmail, tokens } = createSpotifyLinkDto
    const link = this.repo.create({ user_id: userId, spotify_email: spotifyEmail, ...tokens })

    link.syncExpiresAt()
    await this.repo.save(link)

    return link
  }

  private async updateLink(id: number, updateSpotifyLInkDto: UpdateSpotifyLinkDto) {
    const link = await this.repo.findOneBy({ id })

    Object.assign(link, updateSpotifyLInkDto)

    await this.repo.save(link)

    if (!link) {
      throw new BadRequestException(`Cannot find preexisting spotify account link with id ${id}`)
    }

    return link
  }

  private async updateOrCreateLink(userId: number, spotifyEmail: string, tokens: SpotifyTokensDto) {
    const existing = await this.repo.findOneBy({ user_id: userId, spotify_email: spotifyEmail })

    if (!existing) {
      await this.createLink({ user_id: userId, spotify_email: spotifyEmail, tokens })
    } else {
      await this.updateLink(existing.id, {
        access_token: tokens.access_token,
        expires_in: tokens.expires_in,
      })
    }
  }

  public async deleteLink(id: number) {
    const link = await this.repo.findOneBy({ id })
    await link.remove()

    return link
  }
}
