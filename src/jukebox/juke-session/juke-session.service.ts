import { Injectable } from '@nestjs/common'
import { CreateJukeSessionDto, UpdateJukeSessionDto } from './dto/juke-session.dto'

@Injectable()
export class JukeSessionService {
  create(createJukeSessionDto: CreateJukeSessionDto) {
    return 'This action adds a new jukeSession'
  }

  findAll() {
    return `This action returns all jukeSession`
  }

  findOne(id: number) {
    return `This action returns a #${id} jukeSession`
  }

  update(id: number, updateJukeSessionDto: UpdateJukeSessionDto) {
    return `This action updates a #${id} jukeSession`
  }

  remove(id: number) {
    return `This action removes a #${id} jukeSession`
  }
}
