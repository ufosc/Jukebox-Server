import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SpotifyLink } from '../spotify/entities/spotify-link.entity'
import { CreateJukeboxDto } from './dto/create-jukebox.dto'
import { UpdateJukeboxDto } from './dto/update-jukebox.dto'
import { Jukebox, JukeboxSpotifyLinkAssignment } from './entities/jukebox.entity'

@Injectable()
export class JukeboxService {
  constructor(
    @InjectRepository(Jukebox) private repo: Repository<Jukebox>,
    @InjectRepository(JukeboxSpotifyLinkAssignment)
    private assignmentRepo: Repository<JukeboxSpotifyLinkAssignment>,
  ) {}

  create(createJukeboxDto: CreateJukeboxDto) {
    const jukebox = this.repo.create(createJukeboxDto)
    return this.repo.save(jukebox)
  }

  findAll() {
    return this.repo.find({
      relations: ['spotify_link_assignments', 'spotify_link_assignments.spotify_link'],
    })
  }

  async findOne(id: number) {
    const jukebox = await this.repo.findOne({
      where: { id },
      relations: ['spotify_link_assignments', 'spotify_link_assignments.spotify_link'],
    })
    if (!jukebox) {
      throw new NotFoundException('Jukebox not found')
    }

    return jukebox
  }

  async update(id: number, updateJukeboxDto: UpdateJukeboxDto) {
    const jukebox = await this.findOne(id)
    const spotifyEmail = updateJukeboxDto.active_spotify_link.spotify_email

    if (!jukebox) {
      throw new NotFoundException(`Jukebox with id ${id} not found`)
    }

    if ('name' in updateJukeboxDto) {
      jukebox.name = updateJukeboxDto.name
    }

    if ('active_spotify_link' in updateJukeboxDto) {
      const assignment = jukebox.spotify_link_assignments.find(
        (a) => a.spotify_link.spotify_email === spotifyEmail,
      )

      if (!assignment) {
        throw new NotFoundException(
          `Unable to find a linked Spotify account with email ${spotifyEmail}`,
        )
      }

      const deactivateAssignments = jukebox.spotify_link_assignments.filter((a) => a.active)

      for (const dAssignment of deactivateAssignments) {
        dAssignment.active = false
        await this.assignmentRepo.save(dAssignment)
      }

      assignment.active = true
      this.assignmentRepo.save(assignment)
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

  async getJukeboxSpotifyLinks(jukeboxId: number) {
    const jukebox = await this.findOne(jukeboxId)

    return jukebox.spotify_link_assignments.map((assignments) => assignments.spotify_link)
  }

  async addSpotifyLinkToJukebox(jukeboxId: number, spotifyLink: SpotifyLink) {
    const jukebox = await this.findOne(jukeboxId)

    const assignment = this.assignmentRepo.create({
      jukebox_id: jukebox.id,
      spotify_link_id: spotifyLink.id,
    })
    await this.assignmentRepo.save(assignment)

    return jukebox
  }

  async getJukeboxActiveSpotifyLink(jukeboxId: number): Promise<SpotifyLink | undefined> {
    const jukebox = await this.findOne(jukeboxId)
    const assignment = jukebox.spotify_link_assignments.find((lnk) => lnk.active)

    if (!assignment) {
      return
    }

    return assignment.spotify_link
  }
}
