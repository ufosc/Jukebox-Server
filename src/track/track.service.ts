import { Injectable, NotImplementedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateTrackDto, TrackDto } from './dto/track.dto'
import { Track } from './entities/track.entity'
import { plainToInstance } from 'class-transformer'
import { SpotifyService } from 'src/spotify/spotify.service'
import { AccountLinkService } from 'src/jukebox/account-link/account-link.service'
import { JukeboxSearchDto } from 'src/jukebox/dto/jukebox-search.dto'

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track) private trackRepo: Repository<Track>,
    private spotifyService: SpotifyService,
    private accountLinkService: AccountLinkService
  ) { }

  async create(payload: CreateTrackDto, jukeboxId?: number): Promise<TrackDto> {
    // TODO: URL encode artists to account for commas
    let uri: string | undefined
    if (!payload.spotify_uri) {

      if (!jukeboxId) {
        throw new Error('Could not create a track because spotify details could not be found')
      }

      const accountLink = await this.accountLinkService.getActiveAccount(jukeboxId)
      const trackDetails = await this.spotifyService.getTrack(accountLink.spotify_account, payload.spotify_id)
      uri = trackDetails.uri
    }

    const preTrack = this.trackRepo.create({ ...payload, spotify_uri: payload.spotify_uri ?? uri })
    const track = await this.trackRepo.save(preTrack)
    return plainToInstance(TrackDto, track)
  }

  // findAll() {
  //   return `This action returns all track`
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} track`
  // }

  // update(id: number, updateTrackDto: UpdateTrackDto) {
  //   return `This action updates a #${id} track`
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} track`
  // }

  /**
   * Get local reference to a track using the track's
   * spotify id. Will create local reference if one
   * does not exist.
   */
  async getTrack(spotifyId: string, jukeboxId: number): Promise<TrackDto> {
    const result = await this.trackRepo.findOne({ where: { spotify_id: spotifyId } })

    let track: TrackDto | undefined
    if (!result) {

      if (!jukeboxId) {
        throw new Error('Could not create a track because local track does not yet exist and spotify details could not be found')
      }

      const accountLink = await this.accountLinkService.getActiveAccount(+jukeboxId)
      const trackDetails = await this.spotifyService.getTrack(accountLink.spotify_account, spotifyId)
      const releaseYear = new Date(trackDetails.album.release_date).getFullYear()
      track = await this.create({
        release_year: releaseYear,
        spotify_id: spotifyId,
        name: trackDetails.name,
        album: trackDetails.album.name,
        artists: trackDetails.artists.map((artist) => artist.name),
        spotify_uri: trackDetails.uri
      })
    }

    return plainToInstance(TrackDto, result ?? track)
  }

  async searchTracks(jukeboxId: number, payload: JukeboxSearchDto) {
    const link = await this.accountLinkService.getActiveAccount(jukeboxId)
    return await this.spotifyService.searchTracks(link.spotify_account, payload)
  }

  /**
   * FOR TESTING PURPOSES ONLY so null constraint is not violated. NEVER use this in production
   *
   * Please use create()
   * @param payload
   * @returns
   */
  async createTestTrack(payload: CreateTrackDto): Promise<TrackDto> {
    const preTrack = this.trackRepo.create({ ...payload, spotify_uri: "" })
    const track = await this.trackRepo.save(preTrack)
    return plainToInstance(TrackDto, track)
  }
}
