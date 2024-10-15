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
import { Serialize } from 'src/utils'
import { CurrentUser } from '../auth/current-user.decorator'
import { SpotifyLinkSummaryDto } from '../spotify/dto/spotify-link.dto'
import { SpotifyService } from '../spotify/spotify.service'
import { AddJukeboxLinkDto } from './dto/add-jukebox-link.dto'
import { CreateJukeboxDto } from './dto/create-jukebox.dto'
import { JukeboxDto } from './dto/jukebox.dto'
import { UpdateJukeboxDto } from './dto/update-jukebox.dto'
import { JukeboxService } from './jukebox.service'

@Serialize(JukeboxDto)
@ApiTags('jukeboxes')
@Controller('jukebox')
export class JukeboxController {
  constructor(
    private readonly jukeboxService: JukeboxService,
    private spotifyService: SpotifyService,
  ) {}

  @Post('jukeboxes')
  create(@Body() createJukeboxDto: CreateJukeboxDto): Promise<JukeboxDto> {
    return this.jukeboxService.create(createJukeboxDto)
  }

  @Get('jukeboxes')
  findAll(): Promise<JukeboxDto[]> {
    return this.jukeboxService.findAll()
  }

  @Get('jukeboxes/:id')
  findOne(@Param('id') id: string): Promise<JukeboxDto> {
    return this.jukeboxService.findOne(id)
  }

  @Patch('jukeboxes/:id')
  update(@Param('id') id: string, @Body() updateJukeboxDto: UpdateJukeboxDto): Promise<JukeboxDto> {
    return this.jukeboxService.update(id, updateJukeboxDto)
  }

  @Delete('jukeboxes/:id')
  remove(@Param('id') id: string): Promise<JukeboxDto> {
    return this.jukeboxService.remove(id)
  }

  @Get('/:jukeboxId/links')
  getJukeboxLinks(@Param('jukeboxId') jukeboxId: string): Promise<SpotifyLinkSummaryDto[]> {
    return this.jukeboxService.getJukeboxSpotifyLinks(jukeboxId)
  }

  @Post('/:jukeboxId/links')
  async addLinkToJukebox(
    @CurrentUser() user: IUser,
    @Param('jukeboxId') jukeboxId: string,
    @Body() spotifyLink: AddJukeboxLinkDto,
  ): Promise<SpotifyLinkSummaryDto> {
    const link = await this.spotifyService.findOneUserLink(user.id, spotifyLink.spotifyEmail)

    if (!link) {
      throw new NotFoundException(
        `Spotify link with email ${spotifyLink.spotifyEmail} not found for current user.`,
      )
    }

    this.jukeboxService.addSpotifyLinkToJukebox(jukeboxId, link)

    return link
  }
}
