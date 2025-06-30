import { Injectable, NotImplementedException } from '@nestjs/common'
import { UserDto } from 'src/shared'
import { TrackDto } from 'src/track/dto/track.dto'
import { QueuedTrackDto } from '../queue/dto'
import { PlayerActionDto, PlayerStateDto } from './dto'
import { InteractionType } from './entity/player-interaction.entity'

@Injectable()
export class PlayerService {
  setCurrentTrack(jukeboxId: number, track: QueuedTrackDto | TrackDto): PlayerStateDto {
    throw new NotImplementedException()
  }
  playNextFromQueue(jukeboxId: number): PlayerStateDto {
    throw new NotImplementedException()
  }

  getPlayerState(jukeboxId: number): PlayerStateDto {
    throw new NotImplementedException()
  }

  setCurrentProgress(jukeboxId: number, progress: number, timestamp?: Date): PlayerStateDto {
    throw new NotImplementedException()
  }

  addInteraction(
    jukeboxId: number,
    user: UserDto,
    interaction_type: InteractionType,
  ): PlayerStateDto {
    throw new NotImplementedException()
  }

  setIsPlaying(jukeboxId: number, isPlaying: boolean): PlayerStateDto {
    throw new NotImplementedException()
  }

  handleChangedTracks(jukeboxId: number, currentTrack?: TrackDto): PlayerStateDto {
    throw new NotImplementedException()
  }

  executeAction(jukeboxId: number, action: PlayerActionDto): PlayerStateDto {
    throw new NotImplementedException()
  }
}
