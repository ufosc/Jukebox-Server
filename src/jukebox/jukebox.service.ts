import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { SpotifyLinkDto } from '../spotify/dto/spotify-link.dto'
import { SpotifyLink } from '../spotify/schemas/spotify-link.schema'
import { CreateJukeboxDto } from './dto/create-jukebox.dto'
import { UpdateJukeboxDto } from './dto/update-jukebox.dto'
import { Jukebox } from './schemas/jukebox.schema'

@Injectable()
export class JukeboxService {
  constructor(@InjectModel(Jukebox.name) private jukeboxModel: Model<Jukebox>) {}

  create(createJukeboxDto: CreateJukeboxDto) {
    const jukebox = new this.jukeboxModel(createJukeboxDto)
    return jukebox.save()
  }

  findAll() {
    return this.jukeboxModel.find().exec()
  }

  findOne(id: string) {
    const jukebox = this.jukeboxModel.findById(id).exec()
    if (!jukebox) {
      throw new NotFoundException('Jukebox not found')
    }

    return jukebox
  }

  update(id: string, updateJukeboxDto: UpdateJukeboxDto) {
    const jukebox = this.jukeboxModel.findByIdAndUpdate(id, updateJukeboxDto, { new: true }).exec()
    if (!jukebox) {
      throw new NotFoundException(`Jukebox with id ${id} not found`)
    }

    return jukebox
  }

  remove(id: string) {
    const jukebox = this.jukeboxModel.findByIdAndDelete(id).exec()
    if (!jukebox) {
      throw new NotFoundException(`Jukebox with id ${id} not found`)
    }

    return jukebox
  }

  async getJukeboxSpotifyLinks(jukeboxId: string) {
    const jukebox = await this.findOne(jukeboxId)
    return jukebox.spotifyLinks
  }

  async addSpotifyLinkToJukebox(jukeboxId: string, spotifyLink: SpotifyLinkDto) {
    const jukebox = await this.findOne(jukeboxId)

    if (jukebox.spotifyLinks) {
      // FIXME: This does not properly add to list
      jukebox.spotifyLinks.push(spotifyLink as SpotifyLink)
    } else {
      jukebox.spotifyLinks = [spotifyLink as SpotifyLink]
    }
    jukebox.save()

    return jukebox
  }
}
