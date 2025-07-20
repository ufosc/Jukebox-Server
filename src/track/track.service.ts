import { Injectable, NotImplementedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateTrackDto, TrackDto } from './dto/track.dto'
import { Track } from './entities/track.entity'

@Injectable()
export class TrackService {
  constructor(@InjectRepository(Track) private trackRepo: Repository<Track>) {}

  create(payload: CreateTrackDto) {
    // TODO: URL encode artists to account for commas
    return this.trackRepo.create(payload)
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
  async getTrack(spotifyId: string): Promise<TrackDto> {
    throw new NotImplementedException()
  }
}
