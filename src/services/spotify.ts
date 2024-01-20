type SpotifyTokenResponse = {
  accessToken: string
  refreshToken: string
}

interface ISpotifyService {
  // static redirectToSpotifyLogin: (res: Response) => void
  // requestSpotifyToken: (code: string, state: string, user: User) => Promise<SpotifyTokenResponse>
  search: (params: any) => any
  findTracks: (params: any) => any
  findTrackById: (params: any) => any
}

export class SpotifyService implements ISpotifyService {
  private token: string
  constructor(token: string) {
    this.token = token
    console.log(this.token)
  }

  static getSpotifyRedirectUri = (userId: string): string => {
    console.log(userId)
    return ''
  }
  static requestSpotifyToken = async (code: string, state: string) => {
    console.log(code, state)
    return {} as SpotifyTokenResponse
  }
  search = (_: any) => ({})
  findTracks = (_: any) => ({})
  findTrackById = (_: any) => ({})
}
