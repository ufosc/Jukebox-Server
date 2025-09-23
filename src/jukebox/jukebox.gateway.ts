import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  NotImplementedException,
  UnauthorizedException,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import {
  BaseWsExceptionFilter,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { TrackService } from 'src/track/track.service'
import { PlayerAuxUpdateDto, PlayerJoinDto } from './player/dto'
import { PlayerService } from './player/player.service'
import { QueueService } from './queue/queue.service'
import { JukeSessionService } from './juke-session/juke-session.service'
import { CLUBS_URL, NODE_ENV } from 'src/config'
import { JukeboxService } from './jukebox.service'
import { NetworkService } from 'src/network/network.service'
import { WSExceptionFilter } from 'src/utils/filters/ws-exception.filter'

@UseFilters(new WSExceptionFilter())
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UsePipes(new ValidationPipe({ transform: true }))
export class JukeboxGateway implements OnGatewayInit {
  constructor(
    private jukeSessionService: JukeSessionService,
    private jukeboxService: JukeboxService,
    private playerService: PlayerService,
    private queueService: QueueService,
    private tracksService: TrackService,
    private networkService: NetworkService,
  ) {}

  @WebSocketServer() server: Server

  async afterInit(server: Server) {
    server.use(async (client: Socket, next) => {
      try {
        if (NODE_ENV === 'dev') return next()

        const authToken = client.handshake.auth?.token ?? null
        if (!authToken) {
          return next(
            this.handleConnectionRejection(
              client,
              'Connection rejected: missing auth token',
              'Authentication failed: no auth token provided.',
            ),
          )
        }

        const jukeboxId = client.handshake.query?.jukeboxId ?? null
        const role = client.handshake.query?.role ?? null

        if (jukeboxId == null) {
          return next(
            this.handleConnectionRejection(
              client,
              'Connection rejected: missing jukeboxId',
              'Authorization failed: no jukeboxId provided.',
            ),
          )
        }

        if (role == null || (role !== 'admin' && role !== 'member')) {
          return next(
            this.handleConnectionRejection(
              client,
              `Connection rejected: invalid role "${role}"`,
              'Authorization failed: role must be "admin" or "member".',
            ),
          )
        }

        const jukebox = await this.jukeboxService.findOne(parseInt(jukeboxId as string, 10))
        const clubId = jukebox.club_id

        const clubs = (await this.networkService.sendRequest(
          `${CLUBS_URL}/api/v1/club/clubs/${role === 'admin' ? '?is_admin=true' : ''}`,
          'GET',
        )) as { status: number; description: string; data: { id: number; name: string }[] }

        if (clubs.status !== 200) {
          return next(
            this.handleConnectionRejection(
              client,
              `Connection rejected: failed to fetch clubs (status=${clubs.status})`,
              'Authorization failed: could not verify user clubs.',
            ),
          )
        }

        if (!!clubs.data.find((m) => m.id === clubId)) {
          console.log(`[WS] Client ${client.id} authorized for jukebox ${jukeboxId} as ${role}`)
          client['role'] = role
          return next()
        } else {
          return next(
            this.handleConnectionRejection(
              client,
              `Connection rejected: user not member of jukebox ${jukeboxId}`,
              'Authorization failed: you are not a member of this jukebox.',
            ),
          )
        }
      } catch (e) {
        return next(
          this.handleConnectionRejection(
            client,
            'Unexpected error during handshake',
            'Authorization failed: unexpected error',
          ),
        )
      }
    })
  }

  @SubscribeMessage('player-join')
  async handlePlayerJoin(@ConnectedSocket() client: Socket, @MessageBody() payload: PlayerJoinDto) {
    if (client['role'] !== 'member' && client['role'] !== 'admin') {
      throw new WsException('You are not authorized')
    }
    const jukeboxId = payload.jukebox_id.toString()
    client.join(jukeboxId)
    client.to(jukeboxId).emit('player-join-success', { success: true })
  }

  @SubscribeMessage('player-aux-update')
  async handlePlayerAuxUpdate(client: Socket, @MessageBody() payload: PlayerAuxUpdateDto) {
    if (client['role'] !== 'admin') {
      throw new WsException('You are not authorized')
    }

    console.log(payload)
    const { jukebox_id, action, progress, current_track } = payload
    const session = await this.jukeSessionService.getCurrentSession(jukebox_id)

    switch (action) {
      case 'played':
        this.playerService.setIsPlaying(jukebox_id, true)
        break
      case 'paused':
        this.playerService.setIsPlaying(jukebox_id, false)
        break
      case 'changed_tracks':
        if (current_track && !current_track?.spotify_id) {
          throw new WsException('Track must have a spotify id')
        }

        // Check if next track was next in queue, if so pop it
        const nextTrack = await this.queueService.getNextTrack(session.id)

        if (nextTrack.track.spotify_id === current_track?.spotify_id) {
          // Changed track was next from queue
          const track = await this.queueService.popNextTrack(session.id)
          await this.playerService.setCurrentQueuedTrack(jukebox_id, track)
          await this.queueService.queueNextTrackToSpotify(jukebox_id, session.id)
        } else if (current_track) {
          // Changed track was outside of queue
          const track = await this.tracksService.getTrack(current_track.spotify_id!, jukebox_id)
          await this.playerService.setCurrentSpotifyTrack(jukebox_id, track)
        }
        break
      default:
        throw new WsException('Unknown Socket Player Action')
    }

    if (progress != null) {
      this.playerService.setCurrentProgress(jukebox_id, progress, payload.timestamp)
    }

    const playerState = await this.playerService.getPlayerState(jukebox_id)
    client.to(jukebox_id.toString()).emit('player-state-update', playerState)
  }

  private handleConnectionRejection(client: Socket, loggingMessage: string, errorMessage: string) {
    console.log(`[WS] ${loggingMessage} (client ${client.id})`)
    return new Error(errorMessage)
  }
}
