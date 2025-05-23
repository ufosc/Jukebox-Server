import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthInterceptor } from 'src/auth/auth.interceptor'
import { SpotifyService } from 'src/spotify/spotify.service'
import { CurrentUser } from '../auth/current-user.decorator'
import { SpotifyAuthService } from '../spotify/spotify-auth.service'
import { AddJukeboxLinkDto } from './dto/add-jukebox-link.dto'
import { CreateJukeboxDto } from './dto/create-jukebox.dto'
import { CreateJukeboxInteractionDto, JukeboxInteractionDto } from './dto/jukebox-interaction.dto'
import { JukeboxLinkDto } from './dto/jukebox-link.dto'
import { JukeboxSearchDto } from './dto/jukebox-search.dto'
import { JukeboxDto } from './dto/jukebox.dto'
import { PlayerStateDto } from './dto/player-state.dto'
import { UpdateJukeboxDto } from './dto/update-jukebox.dto'
import { JukeboxGateway } from './jukebox.gateway'
import { JukeboxService } from './jukebox.service'
import { AddTrackToQueueDto } from './track-queue/dtos/track-queue.dto'
import { TrackQueueService } from './track-queue/track-queue.service'

@ApiTags('jukeboxes')
@ApiBearerAuth()
@Controller('jukebox/')
@UseInterceptors(AuthInterceptor)
export class JukeboxController {
  constructor(
    private readonly jukeboxSvc: JukeboxService,
    private spotifyAuthSvc: SpotifyAuthService,
    private spotifySvc: SpotifyService,
    private queueSvc: TrackQueueService,
    private jbxGateway: JukeboxGateway,
  ) {}

  @Post('jukeboxes/')
  async create(@Body() createJukeboxDto: CreateJukeboxDto): Promise<JukeboxDto> {
    const jbx = await this.jukeboxSvc.create(createJukeboxDto)
    return jbx.serialize()
  }

  @Get('jukeboxes/')
  async findAll(): Promise<JukeboxDto[]> {
    const jbxs = await this.jukeboxSvc.findAll()
    return jbxs.map((jbx) => jbx.serialize())
  }

  @Get('jukeboxes/club/:id')
  async getClubJbxList(@Param('id') id: number): Promise<JukeboxDto[]> {
    const clubJbxs = await this.jukeboxSvc.findClubJbxs(id)
    return clubJbxs.map((jbx) => jbx.serialize())
  }

  @Get('jukeboxes/:id/')
  async findOne(@Param('id') id: number): Promise<JukeboxDto> {
    const jbx = await this.jukeboxSvc.findOne(id)
    return jbx.serialize()
  }

  @Patch('jukeboxes/:id/')
  async update(
    @Param('id') id: number,
    @Body() updateJukeboxDto: UpdateJukeboxDto,
  ): Promise<JukeboxDto> {
    const jbx = await this.jukeboxSvc.update(id, updateJukeboxDto)
    return jbx.serialize()
  }

  @Delete('jukeboxes/:id/')
  async remove(@Param('id') id: number): Promise<JukeboxDto> {
    const jbx = await this.jukeboxSvc.remove(id)
    return jbx.serialize()
  }

  @Get('/:jukebox_id/links/')
  getJukeboxLinks(@Param('jukebox_id') jukeboxId: number): Promise<JukeboxLinkDto[]> {
    return this.jukeboxSvc.getJukeboxLinks(jukeboxId)
  }

  @Post('/:jukebox_id/links/')
  async addLinkToJukebox(
    @CurrentUser() user: IUser,
    @Param('jukebox_id') jukeboxId: number,
    @Body() jukeboxLink: AddJukeboxLinkDto,
  ): Promise<JukeboxLinkDto> {
    const link = await this.spotifyAuthSvc.findOneUserAccount(user.id, jukeboxLink.email)

    if (!link) {
      throw new NotFoundException(
        `Spotify link with email ${jukeboxLink.email} not found for current user.`,
      )
    }

    return await this.jukeboxSvc.addLinkToJukebox(jukeboxId, link)
  }

  @Delete('/:jukebox_id/links/:id/')
  async deleteJukeboxLink(@Param('jukebox_id') jukeboxId: number, @Param('id') linkId: number) {
    const link = await this.jukeboxSvc.removeJukeboxLink(jukeboxId, linkId)
    return link
  }

  @Get('/:jukebox_id/active-link/')
  async getActiveJukeboxLink(
    @Query('force-refresh') force_refresh: boolean,
    @Param('jukebox_id') jukeboxId: number,
  ) {
    const link = await this.jukeboxSvc.getActiveSpotifyAccount(jukeboxId)
    if (!link) return

    return await this.spotifyAuthSvc.refreshSpotifyAccount(link, force_refresh)
  }

  @Post('/:jukebox_id/active-link/')
  async setActiveJukeboxLink(
    @Param('jukebox_id') jukeboxId: number,
    @Body() jukeboxLink: AddJukeboxLinkDto,
  ) {
    const link = await this.jukeboxSvc.findJukeboxLink(jukeboxId, jukeboxLink)
    const activeLink = await this.jukeboxSvc.setActiveLink(jukeboxId, link.id)

    return await this.spotifyAuthSvc.refreshSpotifyAccount(activeLink.spotify_link)
  }

  @Get('/:jukebox_id/tracks-queue/')
  async getTracksQueue(@Param('jukebox_id') jukeboxId: number) {
    return this.jukeboxSvc.getTrackQueue(jukeboxId, true)
  }

  @Post('/:jukebox_id/tracks-queue/')
  async addTrackToQueue(
    @CurrentUser() user: IUser,
    @Param('jukebox_id') jukeboxId: number,
    @Body() track: AddTrackToQueueDto,
  ) {
    const queuedTrack = await this.jukeboxSvc.addTrackToQueue(jukeboxId, track.track_id, {
      username: user.username,
    })
    await this.jbxGateway.emitTrackQueueUpdate(jukeboxId)

    return queuedTrack
  }

  @Delete('/:jukebox_id/tracks-queue/')
  @HttpCode(HttpStatus.NO_CONTENT)
  async clearTrackQueue(@Param('jukebox_id') jukeboxId: number) {
    // TODO: What should happen when clearing queue, but first track is queued in spotify?
    await this.queueSvc.clearQueue(jukeboxId)
    await this.jbxGateway.emitTrackQueueUpdate(jukeboxId)
  }

  /*

  @Delete('/:jukebox_id/links/:id/')
  async deleteJukeboxLink(@Param('jukebox_id') jukeboxId: number, @Param('id') linkId: number) {

  */
  
  @Delete('/:jukebox_id/tracks-queue/:id/')
  async clearTrack(@Param('jukebox_id') jukeboxId: number, @Param('id') queueSpot: string) {
    const removedTracks = await this.queueSvc.clearSong(jukeboxId, queueSpot)
    await this.jbxGateway.emitTrackQueueUpdate(jukeboxId)
    return removedTracks
  }
  

  @Post('/:jukebox_id/connect/')
  async connectJukeboxPlayer(
    @Param('jukebox_id') jukeboxId: number,
    @Body() body: { device_id: string },
  ) {
    const account = await this.jukeboxSvc.getActiveSpotifyAccount(jukeboxId)
    await this.spotifySvc.setPlayerDevice(account, body.device_id)

    return
  }

  @Get('/:jukebox_id/player-state/')
  async getCurrentTrack(@Param('jukebox_id') jukeboxId: number): Promise<PlayerStateDto | null> {
    return await this.jukeboxSvc.getPlayerState(jukeboxId)
  }

  @Post('/:jukebox_id/interactions/')
  async currentTrackActions(
    @CurrentUser() user: IUser,
    @Param('jukebox_id') jukeboxId: number,
    @Body() body: CreateJukeboxInteractionDto,
  ): Promise<JukeboxInteractionDto> {
    const interaction = await this.jukeboxSvc.doInteraction(jukeboxId, user, body)
    await this.jbxGateway.emitPlayerInteraction(interaction)

    return interaction
  }

  @Post('/:jukebox_id/search/')
  async searchJukeboxTracks(
    @Param('jukebox_id') jukeboxId: number,
    @Body() body: JukeboxSearchDto,
  ) {
    const account = await this.jukeboxSvc.getActiveSpotifyAccount(jukeboxId)
    return this.spotifySvc.searchTracks(account, body)
  }
}
