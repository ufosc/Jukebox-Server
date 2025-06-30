import { Injectable, NotImplementedException } from '@nestjs/common'
import { TrackDto } from './dto/track.dto'

@Injectable()
export class TrackService {
  // create(createTrackDto: CreateTrackDto) {
  //   return 'This action adds a new track'
  // }

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
  async getTrack(spotifyId: string): Promise<TrackDto> {
    throw new NotImplementedException()
  }
}
