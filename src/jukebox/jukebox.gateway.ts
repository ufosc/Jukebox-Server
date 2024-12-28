import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { AppGateway } from 'src/app.gateway'
import { SpotifyService } from 'src/spotify/spotify.service'
import { PlayerAuxUpdateDto } from './dto/track-player-state.dto'
import { JukeboxService } from './jukebox.service'
import { TrackQueueService } from './track-queue/track-queue.service'

@WebSocketGateway()
export class JukeboxGateway {
  constructor(
    private queueSvc: TrackQueueService,
    private jukeboxSvc: JukeboxService,
    private spotifySvc: SpotifyService,
    private appGateway: AppGateway,
  ) {}

  @WebSocketServer() server: Server

  public async emitPlayerUpdate(jukebox_id: number) {
    const state = await this.queueSvc.getPlayerState(jukebox_id)
    this.server.emit('player-update', state)
  }
  
  public async emitTrackQueueUpdate(jukebox_id: number) {
    // TODO: Emit track queue with updated track
  }

  @SubscribeMessage('player-aux-update')
  async handlePlayerAuxUpdate(client: Socket, payload: PlayerAuxUpdateDto) {
    const { current_track, jukebox_id, is_playing, default_next_tracks, position } = payload
    console.log('Received current track:', current_track)

    // Set current player state
    this.queueSvc.setPlayerState(jukebox_id, {
      jukebox_id,
      current_track: current_track,
      is_playing,
      position,
      default_next_tracks,
    })

    // Broadcast new player state
    this.emitPlayerUpdate(jukebox_id)
  }
}
