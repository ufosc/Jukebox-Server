import { Injectable, NotFoundException, NotImplementedException } from '@nestjs/common'
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
  // MARK: CRUD Ops
  // ============================================

  async create(jukeboxId: number, payload: CreateJukeSessionDto): Promise<JukeSessionDto> {
    const preSession = this.jukeSessionRepo.create({ jukebox: { id: jukeboxId } })
    const session = this.jukeSessionRepo.save(preSession)
    return plainToInstance(JukeSessionDto, session)
  }

  async findAll(jukeboxId: number): Promise<JukeSessionDto[]> {
    const sessions = await this.jukeSessionRepo.find({ where: { jukebox: { id: jukeboxId } } })
    return sessions.map((session) => plainToInstance(JukeSessionDto, session))
  }

  async findOne(jukeboxId: number, id: number): Promise<JukeSessionDto> {
    console.log('jukebox id:', jukeboxId)
    console.log('session id:', id)
    const session = await this.jukeSessionRepo.findOne({
      where: { jukebox: { id: jukeboxId }, id },
    })
    if (!session) {
      throw new NotFoundException(`Juke session for jukebox ${jukeboxId} not found with id ${id}`)
    }

    return plainToInstance(JukeSessionDto, session)
  }

  async update(
    jukeboxId: number,
    id: number,
    updateJukeSessionDto: UpdateJukeSessionDto,
  ): Promise<JukeSessionDto> {
    await this.jukeSessionRepo.update({ jukebox: { id }, id }, updateJukeSessionDto)
    return this.findOne(jukeboxId, id)
  }

  async remove(jukeboxId: number, id: number): Promise<JukeSessionDto> {
    const session = await this.findOne(jukeboxId, id)
    await this.jukeSessionRepo.delete({ id })

    return session
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

  async getMemberships(jukeSessionId: number): Promise<JukeSessionMembershipDto[]> {
    const memberships = await this.membershipRepo.find({
      where: { juke_session: { id: jukeSessionId } },
    })
    return memberships.map((membership) => plainToInstance(JukeSessionMembershipDto, membership))
  }

  async getMembership(
    jukeSessionId: number,
    membershipId: number,
  ): Promise<JukeSessionMembershipDto> {
    const membership = await this.membershipRepo.findOne({
      where: { id: membershipId, juke_session: { id: jukeSessionId } },
    })
    if (!membership) {
      throw new NotFoundException(
        `Juke Session Membership with id ${membershipId} not found for juke session ${jukeSessionId}`,
      )
    }

    return plainToInstance(JukeSessionMembershipDto, membership)
  }

  async deleteMembership(
    jukeSessionId: number,
    membershipId: number,
  ): Promise<JukeSessionMembershipDto> {
    const membership = await this.getMembership(jukeSessionId, membershipId)
    await this.membershipRepo.delete({ id: membershipId })

    return membership
  }

  // ============================================
  // MARK: Business Logic
  // ============================================

  /**
   * End Juke Session with ID
   */
  async endSession(jukeboxId: number, id: number): Promise<JukeSessionDto> {
    return await this.update(jukeboxId, id, { end_at: new Date() })
  }

  /**
   * Get Current Juke Session, or throw 404.
   */
  async getCurrentSession(jukeboxId: number): Promise<JukeSessionDto> {
    throw new NotImplementedException()
  }
}
