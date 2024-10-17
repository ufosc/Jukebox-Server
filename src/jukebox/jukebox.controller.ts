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
import { SpotifyLinkDto } from '../spotify/dto/spotify-link.dto'
import { SpotifyService } from '../spotify/spotify.service'
import { AddJukeboxLinkDto } from './dto/add-jukebox-link.dto'
import { CreateJukeboxDto } from './dto/create-jukebox.dto'
import { JukeboxDto } from './dto/jukebox.dto'
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
    return JukeboxDto.serialize(jbx)
  }

  @Get('jukeboxes/')
  async findAll(): Promise<JukeboxDto[]> {
    const jbxs = await this.jukeboxService.findAll()
    return jbxs.map((jbx) => JukeboxDto.serialize(jbx))
  }

  @Get('jukeboxes/:id/')
  async findOne(@Param('id') id: number): Promise<JukeboxDto> {
    const jbx = await this.jukeboxService.findOne(id)
    return JukeboxDto.serialize(jbx)
  }

  @Patch('jukeboxes/:id/')
  async update(
    @Param('id') id: number,
    @Body() updateJukeboxDto: UpdateJukeboxDto,
  ): Promise<JukeboxDto> {
    const jbx = await this.jukeboxService.update(id, updateJukeboxDto)
    return JukeboxDto.serialize(jbx)
  }

  @Delete('jukeboxes/:id/')
  async remove(@Param('id') id: number): Promise<JukeboxDto> {
    const jbx = await this.jukeboxService.remove(id)
    return JukeboxDto.serialize(jbx)
  }

  @Get('/:jukebox_id/links/')
  getJukeboxLinks(@Param('jukebox_id') jukeboxId: number): Promise<SpotifyLinkDto[]> {
    return this.jukeboxService.getJukeboxSpotifyLinks(jukeboxId)
  }

  @Post('/:jukebox_id/links/')
  async addLinkToJukebox(
    @CurrentUser() user: IUser,
    @Param('jukebox_id') jukeboxId: number,
    @Body() spotifyLink: AddJukeboxLinkDto,
  ): Promise<SpotifyLinkDto> {
    const link = await this.spotifyService.findOneUserLink(user.id, spotifyLink.spotifyEmail)

    if (!link) {
      throw new NotFoundException(
        `Spotify link with email ${spotifyLink.spotifyEmail} not found for current user.`,
      )
    }

    await this.jukeboxService.addSpotifyLinkToJukebox(jukeboxId, link)

    return link
  }

  @Get('/:jukebox_id/active-link/')
  async refreshActiveJukeboxLink(@Param('jukebox_id') jukeboxId: number) {
    const link = await this.jukeboxService.getJukeboxActiveSpotifyLink(jukeboxId)
    const refreshed = await this.spotifyService.refreshSpotifyLink(link)

    return refreshed
  }
}
