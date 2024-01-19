import { Response } from 'express'
import { User } from 'src/models'

type SpotifyTokenResponse = {
  accessToken: string
  refreshToken: string
}

interface ISpotifyService {
  redirectToSpotifyLogin: (res: Response) => void
  requestSpotifyToken: (code: string, state: string, user: User) => Promise<SpotifyTokenResponse>
  search: (params: any) => any
  findTracks: (params: any) => any
  findTrackById: (params: any) => any
}

export class SpotifyService implements ISpotifyService {
  private token: string
  constructor(token: string) {
    this.token = token
  }

  redirectToSpotifyLogin = async (res: Response) => {}
  requestSpotifyToken = async (code: string, state: string, user: User) => {
    return {} as SpotifyTokenResponse
  }
  search = (params: any) => ({})
  findTracks = (params: any) => ({})
  findTrackById = (params: any) => ({})
}
