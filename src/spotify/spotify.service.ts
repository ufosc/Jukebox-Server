import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { SpotifyApi } from '@spotify/web-api-ts-sdk'
import { Axios } from 'axios'
import { Model } from 'mongoose'
import { stringify } from 'querystring'
import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI,
  SPOTIFY_SCOPES,
} from 'src/config'
import { CreateSpotifyLinkDto, UpdateSpotifyLinkDto } from './dto/spotify-link.dto'
import { SpotifyTokensDto } from './dto/spotify-tokens.dto'
import { SpotifyLink } from './schemas/spotify-link.schema'

@Injectable()
export class SpotifyService {
  constructor(
    @InjectModel(SpotifyLink.name) private spotifyLinkModel: Model<SpotifyLink>,
    protected axios: Axios,
  ) {}

  private getSdk(tokens: SpotifyTokensDto) {
    return SpotifyApi.withAccessToken(SPOTIFY_CLIENT_ID, tokens.getSnakeCase())
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

    return new SpotifyTokensDto(res.data)
  }

  public getSpotifyRedirectUri(userId: string, finalRedirect?: string) {
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

  public async handleAuthCode(userId: string, code: string) {
    const tokens = await this.authenticateSpotify(code)
    const sdk = this.getSdk(tokens)
    const profile = await sdk.currentUser.profile()

    await this.updateOrCreateLink(userId, profile.email, tokens)

    return profile
  }

  public async findUserLinks(userId: string) {
    return this.spotifyLinkModel.find({ userId }).exec()
  }

  public async findOneUserLink(userId: string, spotifyEmail: string) {
    return this.spotifyLinkModel.findOne({ userId, spotifyEmail }).exec()
  }

  private async createLink(attrs: CreateSpotifyLinkDto) {
    const { userId, spotifyEmail, tokens } = attrs
    const link = new this.spotifyLinkModel({
      userId,
      spotifyEmail,
      ...tokens,
    })
    link.syncExpiresAt()
    await link.save()

    return link
  }

  private async updateLink(id: string, attrs: UpdateSpotifyLinkDto) {
    const link = this.spotifyLinkModel.findByIdAndUpdate(id, attrs, { new: true }).exec()

    if (!link) {
      throw new BadRequestException(`Cannot find preexisting spotify account link with id ${id}`)
    }

    return link
  }

  private async updateOrCreateLink(userId: string, spotifyEmail: string, tokens: SpotifyTokensDto) {
    const existing = await this.spotifyLinkModel.findOne({ userId, spotifyEmail })

    if (!existing) {
      await this.createLink({ userId, spotifyEmail, tokens })
    } else {
      await this.updateLink(existing._id.toString(), {
        accessToken: tokens.accessToken,
        expiresIn: tokens.expiresIn,
      })
    }
  }
}
