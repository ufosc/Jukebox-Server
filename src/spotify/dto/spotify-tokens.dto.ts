export class SpotifyTokensDto {
  accessToken: string
  refreshToken: string
  expiresIn: number
  tokenType: string

  constructor(data: any) {
    this.accessToken = data.access_token ?? data.accessToken
    this.refreshToken = data.refresh_token ?? data.refreshToken
    this.expiresIn = data.expires_in ?? data.expiresIn
    this.tokenType = data.token_type ?? data.tokenType
  }
  
  getSnakeCase() {
    return {
      access_token: this.accessToken,
      refresh_token: this.refreshToken,
      expires_in: this.expiresIn,
      token_type: this.tokenType,
    }
  }
}
