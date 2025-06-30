import {
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { PlayerAuxUpdateDto } from './player/dto'
import { PlayerService } from './player/player.service'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class JukeboxGateway implements OnGatewayDisconnect {
  constructor(private playerService: PlayerService) {}

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
    const { jukebox_id, action, progress } = payload

    switch (action) {
      case 'played':
        this.playerService.setIsPlaying(jukebox_id, true)
        break
      case 'paused':
        this.playerService.setIsPlaying(jukebox_id, false)
        break
      case 'changed_tracks':
        this.playerService.handleChangedTracks(jukebox_id, payload.current_track)
        break
    }

    if (progress != null) {
      this.playerService.setCurrentProgress(jukebox_id, progress, payload.timestamp)
    }
  }
}
