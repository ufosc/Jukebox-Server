import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { CLUBS_URL } from 'src/config'
import { NetworkService } from 'src/network/network.service'
import { Repository } from 'typeorm'
import { CreateJukeboxDto, JukeboxDto, UpdateJukeboxDto } from './dto/jukebox.dto'
import { Jukebox } from './entities/jukebox.entity'

@Injectable()
export class JukeboxService {
  constructor(
    @InjectRepository(Jukebox) private jukeboxRepo: Repository<Jukebox>,
    private networkService: NetworkService,
  ) {}

  async create(payload: CreateJukeboxDto): Promise<JukeboxDto> {
    const preJukebox = this.jukeboxRepo.create(payload)
    const jukebox = this.jukeboxRepo.save(preJukebox)
    return plainToInstance(JukeboxDto, jukebox)
  }

  async findAll(clubId: number, authToken: string): Promise<JukeboxDto[]> {
    let result = await this.jukeboxRepo.find({ where: { club_id: clubId } })

    if (result.length === 0) {
      const clubs = (await this.networkService.sendRequest(
        authToken,
        `${CLUBS_URL}/api/v1/club/clubs/?is_admin=true`,
        'GET',
      )) as {
        status: number
        description: string
        data: { id: number; name: string; alias?: string }[]
      }

      if (clubs.status !== 200) {
        throw new InternalServerErrorException(
          'Could not verify admin status: , ' +
            'Status Code: ' +
            clubs.status +
            ', ' +
            'Description: ' +
            clubs.description,
        )
      }

      const clubDetails = clubs.data.find((m) => m.id === clubId)

      if (!clubDetails) {
        return plainToInstance(JukeboxDto, result)
      }

      await this.create({
        name: (clubDetails.alias ?? clubDetails.name) + ' Jukebox',
        club_id: clubId,
      })
      result = await this.jukeboxRepo.find({ where: { club_id: clubId } })
    }

    return plainToInstance(JukeboxDto, result)
  }

  async findOne(id: number): Promise<JukeboxDto> {
    const result = await this.jukeboxRepo.findOne({ where: { id } })

    if (!result) {
      throw new NotFoundException('No jukebox found with id: ' + id)
    }

    return plainToInstance(JukeboxDto, result)
  }

  async update(id: number, updateJukeboxDto: UpdateJukeboxDto): Promise<JukeboxDto> {
    await this.jukeboxRepo.update({ id }, updateJukeboxDto)
    return this.findOne(id)
  }

  async remove(id: number): Promise<JukeboxDto> {
    const jukebox = await this.findOne(id)
    await this.jukeboxRepo.delete({ id })

    return plainToInstance(JukeboxDto, jukebox)
  }
}
