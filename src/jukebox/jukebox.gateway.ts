import { BadRequestException } from '@nestjs/common'
import {
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { TrackService } from 'src/track/track.service'
import { PlayerAuxUpdateDto } from './player/dto'
import { PlayerService } from './player/player.service'
import { QueueService } from './queue/queue.service'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class JukeboxGateway implements OnGatewayDisconnect {
  constructor(
    private playerService: PlayerService,
    private queueService: QueueService,
    private tracksService: TrackService,
  ) {}

  @WebSocketServer() server: Server

  handleDisconnect(client: Socket) {}

  /**
   * When the frontend instance that is playing a track through a spotify player
   * sends an update to the server.
   *
   * The param changed_tracks is used in case two songs are queued back to back,
   * the changed_tracks flag will allow the server to shift the queue accordingly.
   * The server will still check if it has the correct current_track either way,
   * since the ultimate source of truth is the Spotify Web Player.
   */
  @SubscribeMessage('player-aux-update')
  async handlePlayerAuxUpdate(client: Socket, payload: PlayerAuxUpdateDto) {
    const { jukebox_id, action, progress, current_track } = payload

    switch (action) {
      case 'played':
        this.playerService.setIsPlaying(jukebox_id, true)
        break
      case 'paused':
        this.playerService.setIsPlaying(jukebox_id, false)
        break
      case 'changed_tracks':
        if (current_track && !current_track?.spotify_id) {
          throw new BadRequestException('Track must have a spotify id')
        }

        // Check if next track was next in queue, if so pop it
        const nextTrack = await this.queueService.getNextTrack(jukebox_id)

        if (nextTrack.track.spotify_id === current_track?.spotify_id) {
          // Changed track was next from queue
          const track = await this.queueService.popNextTrack(jukebox_id)
          await this.playerService.setCurrentQueuedTrack(jukebox_id, track)
          await this.queueService.queueNextTrackToSpotify(jukebox_id) // TODO: make this api call
        } else if (current_track) {
          // Changed track was outside of queue
          const track = await this.tracksService.getTrack(current_track.spotify_id!)
          await this.playerService.setCurrentSpotifyTrack(jukebox_id, track)
        }

        break
    }

    if (progress != null) {
      this.playerService.setCurrentProgress(jukebox_id, progress, payload.timestamp)
    }
  }
}
