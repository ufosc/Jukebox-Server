import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { AppGateway } from 'src/app.gateway'
import { SpotifyService } from 'src/spotify/spotify.service'
import { PlayerUpdateDto } from './dto/track-player-state.dto'
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

  @SubscribeMessage('player-update')
  async handleQueueNextTrack(client: Socket, payload: PlayerUpdateDto) {
    const { current_track, jukebox_id } = payload

    // Remove top track, either it's playing or was skipped
    await this.queueSvc.popTrack(jukebox_id)
    
    // Look at the next track, queue it up in Spotify
    const nextTrack = await this.queueSvc.peekTrack(jukebox_id)
    const queuedTracks = await this.queueSvc.listTracks(jukebox_id)

    this.appGateway.emitTrackStateUpdate({
      current_track,
      next_tracks: queuedTracks,
      jukebox_id,
    })

    if (!nextTrack) {
      return
    }

    const account = await this.jukeboxSvc.getActiveSpotifyAccount(jukebox_id)
    this.spotifySvc.queueTrack(account, nextTrack)
  }
}
