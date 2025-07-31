import { Injectable, NotImplementedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { Repository } from 'typeorm'
import { CreateJukeSessionDto, JukeSessionDto, UpdateJukeSessionDto } from './dto/juke-session.dto'
import { CreateJukeSessionMembershipDto, JukeSessionMembershipDto } from './dto/membership.dto'
import { JukeSession } from './entities/juke-session.entity'
import { JukeSessionMembership } from './entities/membership.entity'

@Injectable()
export class JukeSessionService {
  constructor(
    @InjectRepository(JukeSession) private jukeSessionRepo: Repository<JukeSession>,
    @InjectRepository(JukeSessionMembership)
    private membershipRepo: Repository<JukeSessionMembership>,
  ) {}

  // ============================================
  // MARK: CRUD Operations
  // ============================================

  async create(jukeboxId: number, payload: CreateJukeSessionDto): Promise<JukeSessionDto> {
    const session = this.jukeSessionRepo.create({ jukebox: { id: jukeboxId } })
    return plainToInstance(JukeSessionDto, session)
  }

  async findAll(): Promise<JukeSessionDto[]> {
    throw new NotImplementedException()
  }

  async findOne(id: number): Promise<JukeSessionDto> {
    throw new NotImplementedException()
  }

  async update(id: number, updateJukeSessionDto: UpdateJukeSessionDto): Promise<JukeSessionDto> {
    throw new NotImplementedException()
  }

  async remove(id: number): Promise<JukeSessionDto> {
    throw new NotImplementedException()
  }

  async createMembership(
    jukeSessionId: number,
    payload: CreateJukeSessionMembershipDto,
  ): Promise<JukeSessionMembershipDto> {
    const membership = this.membershipRepo.create({
      juke_session: { id: jukeSessionId },
      ...payload,
    })
    return plainToInstance(JukeSessionMembershipDto, membership)
  }

  async getMemberships(jukeSessionId: number): Promise<JukeSessionMembership[]> {
    throw new NotImplementedException()
  }

  async getMembership(jukeSessionId: number, membershipId: number): Promise<JukeSessionMembership> {
    throw new NotImplementedException()
  }

  async deleteMembership(
    jukeSessionId: number,
    membershipId: number,
  ): Promise<JukeSessionMembership> {
    throw new NotImplementedException()
  }

  // ============================================
  // MARK: Business Logic
  // ============================================

  /**
   * End Juke Session with ID
   */
  async endSession(id: number): Promise<JukeSession> {
    throw new NotImplementedException()
  }

  /**
   * Get Current Juke Session, or throw 404.
   */
  async getCurrentSession(): Promise<JukeSession> {
    throw new NotImplementedException()
  }
}
