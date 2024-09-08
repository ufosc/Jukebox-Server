import {
  authenticateSpotify,
  getSpotifyEmail,
  getSpotifySdk,
  type SpotifySdk,
  type SpotifyTokens
} from 'server/lib'
import { SpotifyAuth } from 'server/models'

export class SpotifyService {
  private auth: SpotifyAuth
  public sdk: SpotifySdk

  private constructor(auth: SpotifyAuth) {
    this.auth = auth
    this.sdk = getSpotifySdk(auth)
  }

  public static async connect(spotifyEmail: string): Promise<SpotifyService> {
    const spotifyAuth = await SpotifyAuth.findOne({ spotifyEmail })

    if (!spotifyAuth)
      throw new Error(`Unable to find connected spotify account with email ${spotifyEmail}.`)

    if (spotifyAuth.expiresAt.getTime() > Date.now()) {
      return new SpotifyService(spotifyAuth)
    }

    const tokens = await authenticateSpotify({
      type: 'refresh_token',
      payload: spotifyAuth.refreshToken
    })

    const updatedAuth = await this.udpateOrCreateAuth(
      spotifyAuth.userId.toString(),
      spotifyAuth.spotifyEmail,
      tokens
    )

    return new SpotifyService(updatedAuth)
  }

  public static async authenticateUser(userId: string, code: string): Promise<SpotifyService> {
    const tokens = await authenticateSpotify({ type: 'authorization_code', payload: code })
    const userEmail = await getSpotifyEmail(tokens)

    const spotifyAuth = await this.udpateOrCreateAuth(userId, userEmail, tokens)
    return new SpotifyService(spotifyAuth)
  }

  private static async udpateOrCreateAuth(
    userId: string,
    spotifyEmail: string,
    tokens: SpotifyTokens
  ): Promise<SpotifyAuth> {
    const query = await SpotifyAuth.findOne({ userId, spotifyEmail })

    if (!query) {
      return await SpotifyAuth.create({
        userId,
        spotifyEmail,
        expiresAt: new Date(Date.now() + tokens.expiresIn * 1000),
        ...tokens
      })
    } else {
      // const updated = await query.updateOne({ ...tokens }, { new: true })
      query.accessToken = tokens.accessToken
      query.expiresIn = tokens.expiresIn
      query.expiresAt = new Date(Date.now() + tokens.expiresIn * 1000)
      return query
    }
  }

  public async getProfile() {
    return await this.sdk.currentUser.profile()
  }
}
