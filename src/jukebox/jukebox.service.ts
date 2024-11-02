import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Not, Repository } from 'typeorm'
import { SpotifyAccount } from '../spotify/entities/spotify-account.entity'
import { AddJukeboxLinkDto } from './dto/add-jukebox-link.dto'
import { CreateJukeboxDto } from './dto/create-jukebox.dto'
import { JukeboxLinkDto } from './dto/jukebox.dto'
import { UpdateJukeboxDto } from './dto/update-jukebox.dto'
import { Jukebox, JukeboxLinkAssignment } from './entities/jukebox.entity'

@Injectable()
export class JukeboxService {
  constructor(
    @InjectRepository(Jukebox) private repo: Repository<Jukebox>,
    @InjectRepository(JukeboxLinkAssignment)
    private assignmentRepo: Repository<JukeboxLinkAssignment>,
  ) {}

  create(createJukeboxDto: CreateJukeboxDto) {
    const jukebox = this.repo.create(createJukeboxDto)
    return this.repo.save(jukebox)
  }

  findAll() {
    return this.repo.find({
      relations: ['link_assignments', 'link_assignments.spotify_link'],
    })
  }

  async findOne(id: number) {
    const jukebox = await this.repo.findOne({
      where: { id },
      relations: ['link_assignments', 'link_assignments.spotify_link'],
    })
    if (!jukebox) {
      throw new NotFoundException('Jukebox not found')
    }

    return jukebox
  }

  async update(id: number, updateJukeboxDto: UpdateJukeboxDto) {
    const jukebox = await this.findOne(id)

    if (!jukebox) {
      throw new NotFoundException(`Jukebox with id ${id} not found`)
    }

    if ('name' in updateJukeboxDto) {
      jukebox.name = updateJukeboxDto.name
    }

    this.repo.save(jukebox)

    return jukebox
  }

  async remove(id: number) {
    const jukebox = await this.findOne(id)

    if (!jukebox) {
      throw new NotFoundException(`Jukebox with id ${id} not found`)
    }

    await this.repo.delete({ id })

    return jukebox
  }

  async getJukeboxLinks(jukeboxId: number): Promise<JukeboxLinkDto[]> {
    const jukebox = await this.findOne(jukeboxId)

    return jukebox.link_assignments.map((assignment) => assignment.serialize())
  }

  async findJukeboxLink(jukeboxId: number, jukeboxLink: AddJukeboxLinkDto) {
    const link = await this.assignmentRepo.findOne({
      where: {
        jukebox_id: jukeboxId,
        spotify_link: { spotify_email: jukeboxLink.email },
      },
    })

    if (!link) {
      throw new NotFoundException(`Jukebox link not found with email ${jukeboxLink.email}.`)
    }

    return link
  }

  async removeJukeboxLink(jukeboxId: number, linkId: number) {
    const link = await this.assignmentRepo.findOne({ where: { jukebox_id: jukeboxId, id: linkId } })
    if (!link) {
      throw new NotFoundException(`Jukebox link not found with id ${linkId}.`)
    }

    await this.assignmentRepo.delete({ jukebox_id: jukeboxId, id: linkId })

    return link
  }

  async setActiveLink(jukeboxId: number, linkId: number) {
    await this.assignmentRepo.update(
      { jukebox_id: jukeboxId, active: true, id: Not(linkId) },
      { active: false },
    )
    const assignment = await this.assignmentRepo.findOne({
      where: { jukebox_id: jukeboxId, id: linkId },
      relations: ['spotify_link'],
    })

    if (!assignment) {
      throw new NotFoundException('Spotify assignment not found.')
    }

    assignment.active = true
    await assignment.save()

    return assignment
  }

  async addLinkToJukebox(jukeboxId: number, spotifyLink: SpotifyAccount): Promise<JukeboxLinkDto> {
    const jukebox = await this.findOne(jukeboxId)

    const assignment = this.assignmentRepo.create({
      jukebox_id: jukebox.id,
      jukebox: jukebox,
      spotify_link_id: spotifyLink.id,
      spotify_link: spotifyLink,
    })

    const record = await this.assignmentRepo.save(assignment)
    await this.setActiveLink(jukebox.id, record.id)

    return assignment.serialize()
  }

  async getActiveSpotifyAccount(jukeboxId: number): Promise<SpotifyAccount | undefined> {
    const jukebox = await this.findOne(jukeboxId)
    const assignment = jukebox.link_assignments.find((lnk) => lnk.active)

    if (!assignment) {
      return
    }

    return assignment.spotify_link
  }
}
