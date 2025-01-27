import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { AppGateway } from 'src/app.gateway'
import { SpotifyService } from 'src/spotify/spotify.service'
import { JukeboxInteractionDto } from './dto/jukebox-interaction.dto'
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
    const state = await this.jukeboxSvc.getPlayerState(jukebox_id)
    this.server.emit('player-update', state)
  }

  public async emitPlayerInteraction(payload: JukeboxInteractionDto) {
    this.server.emit('player-interaction', payload)
  }

  public async emitTrackQueueUpdate(jukebox_id: number) {
    const nextTracks = await this.jukeboxSvc.getTrackQueue(jukebox_id, true)
    this.server.emit('track-queue-update', nextTracks)
  }

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
    const {
      current_track: player_track,
      jukebox_id,
      is_playing,
      progress,
      changed_tracks,
    } = payload
    const playerTrackIsNext = await this.jukeboxSvc.playerTrackIsNext(jukebox_id, player_track)
    const playerState = await this.jukeboxSvc.getPlayerState(jukebox_id)

    if (changed_tracks && !playerTrackIsNext) {
      // Case: New track, not top of queue (someone set track from spotify directly)
      console.debug('WS event: New track, not top of queue')
      await this.jukeboxSvc.setCurrentTrack(jukebox_id, player_track)
      await this.jukeboxSvc.updatePlayerState(jukebox_id, { is_playing, progress })
      await this.emitPlayerUpdate(jukebox_id)

      // Send update to tracks, will use spotify's queue
      await this.emitTrackQueueUpdate(jukebox_id)
    } else if (changed_tracks && playerTrackIsNext) {
      // Case: New track, is top of queue (a new song was queued up)
      console.debug('WS event: New track, is top of queue')
      await this.jukeboxSvc.shiftNextTrack(jukebox_id)
      await this.emitPlayerUpdate(jukebox_id)
      await this.emitTrackQueueUpdate(jukebox_id)
    } else {
      // Case: Same track, change in a player attribute like "is_playing" or "progress"
      console.debug('WS event: Same track, other change')
      if (playerState?.current_track?.track.id !== player_track.id) {
        // Resync the player track if needed
        console.debug('Same track is not current track')
        await this.jukeboxSvc.setCurrentTrack(jukebox_id, player_track)
      }

      await this.jukeboxSvc.updatePlayerState(jukebox_id, { is_playing, progress })
      await this.emitPlayerUpdate(jukebox_id)
    }
  }
}
