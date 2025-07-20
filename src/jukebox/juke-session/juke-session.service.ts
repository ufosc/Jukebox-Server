import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateJukeSessionDto, UpdateJukeSessionDto } from './dto/juke-session.dto'
import { CreateJukeSessionMembershipDto } from './dto/membership.dto'
import { JukeSession } from './entities/juke-session.entity'
import { JukeSessionMembership } from './entities/membership.entity'

@Injectable()
export class JukeSessionService {
  constructor(
    @InjectRepository(JukeSession) private jukeSessionRepo: Repository<JukeSession>,
    @InjectRepository(JukeSessionMembership)
    private membershipRepo: Repository<JukeSessionMembership>,
  ) {}

  create(payload: CreateJukeSessionDto) {
    return this.jukeSessionRepo.create(payload)
  }

  createMembership(payload: CreateJukeSessionMembershipDto) {
    return this.membershipRepo.create(payload)
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
