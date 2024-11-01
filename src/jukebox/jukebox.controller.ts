import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { SpotifyService } from 'src/spotify/spotify.service'
import { CurrentUser } from '../auth/current-user.decorator'
import { SpotifyAuthService } from '../spotify/spotify-auth.service'
import { AddJukeboxLinkDto } from './dto/add-jukebox-link.dto'
import { CreateJukeboxDto } from './dto/create-jukebox.dto'
import { JukeboxDto, JukeboxLinkDto } from './dto/jukebox.dto'
import { UpdateJukeboxDto } from './dto/update-jukebox.dto'
import { JukeboxService } from './jukebox.service'
import { TrackQueueService } from './track-queue/track-queue.service'

@ApiTags('jukeboxes')
@Controller('jukebox/')
export class JukeboxController {
  constructor(
    private readonly jukeboxSvc: JukeboxService,
    private spotifyAuthSvc: SpotifyAuthService,
    private spotifySvc: SpotifyService,
    private queueSvc: TrackQueueService,
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
  async getActiveJukeboxLink(@Param('jukebox_id') jukeboxId: number) {
    const link = await this.jukeboxSvc.getJukeboxActiveSpotifyLink(jukeboxId)
    if (!link) {
      return
    }

    const refreshed = await this.spotifyAuthSvc.refreshSpotifyAccount(link)
    return refreshed
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
    return this.queueSvc.listTracks(jukeboxId)
  }

  @Post('/:jukebox_id/tracks-queue')
  async addTrackToQueue(
    @Param('jukebox_id') jukeboxId: number,
    @Body() track: { trackId: string; position?: number },
  ) {
    const account = await this.jukeboxSvc.getJukeboxActiveSpotifyLink(jukeboxId)
    const trackItem = await this.spotifySvc.getTrack(account, track.trackId)

    this.queueSvc.queueTrack(jukeboxId, trackItem, track.position)

    return trackItem
  }
}
