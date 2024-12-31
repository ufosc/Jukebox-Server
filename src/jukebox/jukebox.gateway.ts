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
    const nextTracks = await this.queueSvc.getTrackQueueOrDefaults(jukebox_id)
    this.server.emit('track-queue-update', nextTracks)
  }

  @SubscribeMessage('player-aux-update')
  async handlePlayerAuxUpdate(client: Socket, payload: PlayerAuxUpdateDto) {
    const { current_track, jukebox_id, is_playing, default_next_tracks, progress } = payload

    const currentPlayerState = await this.queueSvc.getPlayerState(jukebox_id)

    if (current_track.uid !== currentPlayerState?.current_track.uid) {
      this.queueSvc.popTrack(jukebox_id)
      this.emitTrackQueueUpdate(jukebox_id)
    }

    // Set current player state
    this.queueSvc.setPlayerState(jukebox_id, {
      jukebox_id,
      current_track,
      is_playing,
      progress,
      default_next_tracks,
    })

    // Broadcast new player state
    this.emitPlayerUpdate(jukebox_id)
  }
}
