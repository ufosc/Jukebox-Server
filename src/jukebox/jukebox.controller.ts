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
import { CurrentUser } from '../auth/current-user.decorator'
import { SpotifyService } from '../spotify/spotify.service'
import { AddJukeboxLinkDto } from './dto/add-jukebox-link.dto'
import { CreateJukeboxDto } from './dto/create-jukebox.dto'
import { JukeboxDto, JukeboxLinkDto } from './dto/jukebox.dto'
import { UpdateJukeboxDto } from './dto/update-jukebox.dto'
import { JukeboxService } from './jukebox.service'

@ApiTags('jukeboxes')
@Controller('jukebox/')
export class JukeboxController {
  constructor(
    private readonly jukeboxService: JukeboxService,
    private spotifyService: SpotifyService,
  ) {}

  @Post('jukeboxes/')
  async create(@Body() createJukeboxDto: CreateJukeboxDto): Promise<JukeboxDto> {
    const jbx = await this.jukeboxService.create(createJukeboxDto)
    return jbx.serialize()
  }

  @Get('jukeboxes/')
  async findAll(): Promise<JukeboxDto[]> {
    const jbxs = await this.jukeboxService.findAll()
    return jbxs.map((jbx) => jbx.serialize())
  }

  @Get('jukeboxes/:id/')
  async findOne(@Param('id') id: number): Promise<JukeboxDto> {
    const jbx = await this.jukeboxService.findOne(id)
    return jbx.serialize()
  }

  @Patch('jukeboxes/:id/')
  async update(
    @Param('id') id: number,
    @Body() updateJukeboxDto: UpdateJukeboxDto,
  ): Promise<JukeboxDto> {
    const jbx = await this.jukeboxService.update(id, updateJukeboxDto)
    return jbx.serialize()
  }

  @Delete('jukeboxes/:id/')
  async remove(@Param('id') id: number): Promise<JukeboxDto> {
    const jbx = await this.jukeboxService.remove(id)
    return jbx.serialize()
  }

  @Get('/:jukebox_id/links/')
  getJukeboxLinks(@Param('jukebox_id') jukeboxId: number): Promise<JukeboxLinkDto[]> {
    return this.jukeboxService.getJukeboxLinks(jukeboxId)
  }

  @Post('/:jukebox_id/links/')
  async addLinkToJukebox(
    @CurrentUser() user: IUser,
    @Param('jukebox_id') jukeboxId: number,
    @Body() jukeboxLink: AddJukeboxLinkDto,
  ): Promise<JukeboxLinkDto> {
    const link = await this.spotifyService.findOneUserLink(user.id, jukeboxLink.email)

    if (!link) {
      throw new NotFoundException(
        `Spotify link with email ${jukeboxLink.email} not found for current user.`,
      )
    }

    return await this.jukeboxService.addLinkToJukebox(jukeboxId, link)
  }

  @Delete('/:jukebox_id/links/:id/')
  async deleteJukeboxLink(@Param('jukebox_id') jukeboxId: number, @Param('id') linkId: number) {
    const link = await this.jukeboxService.removeJukeboxLink(jukeboxId, linkId)
    return link
  }

  @Get('/:jukebox_id/active-link/')
  async getActiveJukeboxLink(@Param('jukebox_id') jukeboxId: number) {
    const link = await this.jukeboxService.getJukeboxActiveSpotifyLink(jukeboxId)
    if (!link) {
      return
    }

    const refreshed = await this.spotifyService.refreshSpotifyLink(link)
    return refreshed
  }

  @Post('/:jukebox_id/active-link/')
  async setActiveJukeboxLink(
    @Param('jukebox_id') jukeboxId: number,
    @Body() jukeboxLink: AddJukeboxLinkDto,
  ) {
    const link = await this.jukeboxService.findJukeboxLink(jukeboxId, jukeboxLink)
    const activeLink = await this.jukeboxService.setActiveLink(jukeboxId, link.id)

    return await this.spotifyService.refreshSpotifyLink(activeLink.spotify_link)
  }
}
