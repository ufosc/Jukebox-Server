import { Injectable, InternalServerErrorException, NotFoundException, NotImplementedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { QueryFailedError, Repository } from 'typeorm'
import { CreateJukeSessionDto, JukeSessionDto, UpdateJukeSessionDto } from './dto/juke-session.dto'
import { CreateJukeSessionMembershipDto, JukeSessionMembershipDto } from './dto/membership.dto'
import { JukeSession } from './entities/juke-session.entity'
import { JukeSessionMembership } from './entities/membership.entity'
import { generateJoinCode } from './utils/generate-join-code'

@Injectable()
export class JukeSessionService {
  constructor(
    @InjectRepository(JukeSession) private jukeSessionRepo: Repository<JukeSession>,
    @InjectRepository(JukeSessionMembership)
    private membershipRepo: Repository<JukeSessionMembership>,
  ) { }

  // ============================================
  // MARK: CRUD Ops
  // ============================================

  async create(jukeboxId: number, payload: CreateJukeSessionDto): Promise<JukeSessionDto> {
    const preSession = this.jukeSessionRepo.create({
      jukebox: { id: jukeboxId },
      start_at: payload.start_at ?? new Date(),
      end_at: payload.end_at,
    })

    // Generate Unique Join Code
    let session: JukeSession
    const MAX_RETRIES = 25;
    let retries = 0;

    while (true) {
      try {
        preSession.join_code = generateJoinCode()
        session = await this.jukeSessionRepo.save(preSession)
        break
      } catch (err) {
        // Checks Postgres Unique Constraint Error Code
        if (err instanceof QueryFailedError && err.driverError?.code === '23505') {
          ++retries
          if (retries > MAX_RETRIES) {
            throw new InternalServerErrorException('Failed to generate a unique join code');
          }
        } else {
          throw err
        }
      }
    }

    return plainToInstance(JukeSessionDto, session)
  }

  async findAll(jukeboxId: number): Promise<JukeSessionDto[]> {
    const sessions = await this.jukeSessionRepo.find({ where: { jukebox: { id: jukeboxId } } })
    return sessions.map((session) => plainToInstance(JukeSessionDto, session))
  }

  async findOne(id: number): Promise<JukeSessionDto> {
    const session = await this.jukeSessionRepo.findOne({
      where: { id },
    })
    if (!session) {
      throw new NotFoundException(`Juke session not found with id ${id}`)
    }

    return plainToInstance(JukeSessionDto, session)
  }

  async update(
    jukeboxId: number,
    id: number,
    updateJukeSessionDto: UpdateJukeSessionDto,
  ): Promise<JukeSessionDto> {
    await this.jukeSessionRepo.update({ jukebox: { id: jukeboxId }, id }, updateJukeSessionDto)
    return await this.findOne(id)
  }

  async remove(id: number): Promise<JukeSessionDto> {
    const session = await this.findOne(id)
    await this.jukeSessionRepo.delete({ id })

    return session
  }

  async createMembership(
    jukeSessionId: number,
    payload: CreateJukeSessionMembershipDto,
  ): Promise<JukeSessionMembershipDto> {
    const preMembership = this.membershipRepo.create({
      juke_session: { id: jukeSessionId },
      ...payload,
    })
    const membership = await this.membershipRepo.save(preMembership)
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
    const session = await this.jukeSessionRepo.findOne({
      where: { jukebox: { id: jukeboxId }, is_active: true },
    })
    if (!session) {
      throw new NotFoundException(`No Current Juke session Found for jukebox ${jukeboxId}`)
    }

    return plainToInstance(JukeSessionDto, session)
  }
}
