import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'
import { TrackStateUpdateDto } from './jukebox/dto/track-player-state.dto'

@WebSocketGateway()
export class AppGateway {
  @WebSocketServer() server: Server

  public emitTrackStateUpdate(payload: TrackStateUpdateDto) {
    this.server.emit('track-state-update', payload)
  }
}
