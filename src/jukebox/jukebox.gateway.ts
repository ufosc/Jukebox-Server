import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Track } from '@spotify/web-api-ts-sdk'
import { Server, Socket } from 'socket.io'
import { SpotifyService } from 'src/spotify/spotify.service'
import { JukeboxService } from './jukebox.service'
import { TrackQueueService } from './track-queue/track-queue.service'

@WebSocketGateway()
export class JukeboxGateway {
  constructor(
    private queueSvc: TrackQueueService,
    private jukeboxSvc: JukeboxService,
    private spotifySvc: SpotifyService,
  ) {}

  @WebSocketServer() server: Server

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!'
  }

  @SubscribeMessage('track-state')
  async handleQueueNextTrack(
    client: Socket,
    payload: { new_track: boolean; track: Track; jukebox_id: number },
  ) {
    const { new_track, track, jukebox_id } = payload

    if (!new_track) {
      return
    }

    let nextTrack = await this.queueSvc.peekTrack(jukebox_id)
    if (String(nextTrack?.name) === String(track.name)) {
      await this.queueSvc.popTrack(jukebox_id)
      nextTrack = await this.queueSvc.peekTrack(jukebox_id)
    }

    if (!nextTrack) {
      return
    }

    const account = await this.jukeboxSvc.getActiveSpotifyAccount(jukebox_id)
    this.spotifySvc.queueTrack(account, nextTrack)
  }
}
