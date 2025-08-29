import { Injectable, NotImplementedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { Repository } from 'typeorm'
import { CreateJukeboxDto, JukeboxDto, UpdateJukeboxDto } from './dto/jukebox.dto'
import { Jukebox } from './entities/jukebox.entity'

@Injectable()
export class JukeboxService {
  constructor(@InjectRepository(Jukebox) private jukeboxRepo: Repository<Jukebox>) {}

  async create(payload: CreateJukeboxDto): Promise<JukeboxDto> {
    const preJukebox = this.jukeboxRepo.create(payload)
    const jukebox = this.jukeboxRepo.save(preJukebox)
    return plainToInstance(JukeboxDto, jukebox)
  }

  findAll(): JukeboxDto[] {
    throw new NotImplementedException()
  }

  findOne(id: number): JukeboxDto {
    throw new NotImplementedException()
  }

  update(id: number, updateJukeboxDto: UpdateJukeboxDto): JukeboxDto {
    throw new NotImplementedException()
  }

  remove(id: number) {
    throw new NotImplementedException()
  }
}
