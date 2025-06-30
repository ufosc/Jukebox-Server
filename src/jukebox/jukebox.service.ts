import { Injectable, NotImplementedException } from '@nestjs/common'
import { CreateJukeboxDto, JukeboxDto, UpdateJukeboxDto } from './dto/jukebox.dto'

@Injectable()
export class JukeboxService {
  async create(createJukeboxDto: CreateJukeboxDto): Promise<JukeboxDto> {
    throw new NotImplementedException()
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
