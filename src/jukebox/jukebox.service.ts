import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SpotifyLink } from '../spotify/entities/spotify-link.entity'
import { CreateJukeboxDto } from './dto/create-jukebox.dto'
import { UpdateJukeboxDto } from './dto/update-jukebox.dto'
import { Jukebox, JukeboxSpotifyLinkAssignment } from './entities/jukebox.entity'

@Injectable()
export class JukeboxService {
  // constructor(@InjectModel(Jukebox.name) private jukeboxModel: Model<Jukebox>) {}
  // private repo: Repository<Jukebox>
  // private assignmentRepo: Repository<JukeboxSpotifyLinkAssignment>

  // constructor(private dataSource: DataSource) {
  //   this.repo = this.dataSource.getRepository(Jukebox)
  //   this.assignmentRepo = this.dataSource.getRepository(JukeboxSpotifyLinkAssignment)
  // }
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
    return this.repo.find()
  }

  async findOne(id: number) {
    const jukebox = await this.repo.findOneBy({ id })
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

    Object.assign(jukebox, updateJukeboxDto)
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

    this.assignmentRepo.create({ jukebox, spotify_link: spotifyLink })

    return jukebox
  }
}
