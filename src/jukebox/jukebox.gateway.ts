import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { AppGateway } from 'src/app.gateway'
import { SpotifyService } from 'src/spotify/spotify.service'
import { PlayerStateDto, PlayerStateUpdateDto } from './dto/player-state.dto'
import { PlayerAuxUpdateDto } from './dto/track-player-state.dto'
import { JukeboxService } from './jukebox.service'
import { TrackQueueService } from './track-queue/track-queue.service'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
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

  public async emitPlayerAction(jukebox_id: number, payload: PlayerStateUpdateDto) {
    const state = await this.queueSvc.getPlayerState(jukebox_id)
    this.server.emit('player-action', state)
  }

  public async emitTrackQueueUpdate(jukebox_id: number) {
    const nextTracks = await this.jukeboxSvc.getTrackQueueOrDefaults(jukebox_id)
    this.server.emit('track-queue-update', nextTracks)
  }

  @SubscribeMessage('player-aux-update')
  async handlePlayerAuxUpdate(client: Socket, payload: PlayerAuxUpdateDto) {
    const { current_track, jukebox_id, is_playing, default_next_tracks, progress, changed_tracks } =
      payload
    const prevNextTracks = await this.queueSvc.getTrackQueue(jukebox_id)
    let prevState: Partial<PlayerStateDto> = await this.queueSvc.getPlayerState(jukebox_id)

    if (changed_tracks) {
      prevState = {
        current_track: null,
      }
    }

    // Set current player state
    await this.queueSvc.setPlayerState(jukebox_id, {
      ...prevState,
      jukebox_id,
      current_track: { ...(prevState?.current_track || {}), ...current_track },
      is_playing,
      progress
    })

    // Broadcast new player state
    await this.emitPlayerUpdate(jukebox_id)

    if (current_track === undefined) return
    const currTrackWasNext = prevNextTracks.length > 0 && prevNextTracks[0]?.track.id === current_track.track.id

    if (changed_tracks) {
      if (currTrackWasNext) {
        // The current track was next in queue
        await this.queueSvc.popTrack(jukebox_id)
        await this.jukeboxSvc.queueUpNextTrack(jukebox_id)
      } else {
        // Current track was not next in queue
        await this.jukeboxSvc.queueUpNextTrack(jukebox_id, true)
      }

      await this.emitTrackQueueUpdate(jukebox_id)
    }
  }
}
