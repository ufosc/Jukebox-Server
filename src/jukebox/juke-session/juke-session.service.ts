import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { BASE_URL, CLUBS_URL } from 'src/config'
import { NetworkService } from 'src/network/network.service'
import { QueryFailedError, Repository } from 'typeorm'
import { CreateJukeSessionDto, JukeSessionDto, UpdateJukeSessionDto } from './dto/juke-session.dto'
import {
  CreateJukeSessionMembershipDto,
  JukeSessionMembershipCountDto,
  JukeSessionMembershipDto,
} from './dto/membership.dto'
import { JukeSession } from './entities/juke-session.entity'
import { JukeSessionMembership } from './entities/membership.entity'
import { generateJoinCode } from './utils/generate-join-code'

@Injectable()
export class JukeSessionService {
  constructor(
    @InjectRepository(JukeSession) private jukeSessionRepo: Repository<JukeSession>,
    @InjectRepository(JukeSessionMembership)
    private membershipRepo: Repository<JukeSessionMembership>,
    private networkService: NetworkService,
  ) {}

  // ============================================
  // MARK: CRUD Ops
  // ============================================

  async create(
    jukeboxId: number,
    payload: CreateJukeSessionDto,
    token: string,
  ): Promise<JukeSessionDto> {
    // Deactivate session if it should be expired
    try {
      const activeSession = await this.getCurrentSession(jukeboxId)
      if (activeSession.end_at <= new Date()) {
        this.update(activeSession.id, { is_active: false })
      }
    } catch (err) {
      if (!(err instanceof NotFoundException)) {
        throw err
      }
    }

    const preSession = this.jukeSessionRepo.create({
      jukebox: { id: jukeboxId },
      start_at: payload.start_at ?? new Date(),
      end_at: payload.end_at,
    })

    // Generate Unique Join Code
    let session: JukeSession
    const MAX_RETRIES = 25
    let retries = 0

    while (true) {
      try {
        preSession.join_code = generateJoinCode()
        session = await this.jukeSessionRepo.save(preSession)
        break
      } catch (err) {
        const dbError = err.driverError
        // Checks Postgres Unique Constraint Error Code
        if (err instanceof QueryFailedError && dbError?.code === '23505') {
          if (dbError.constraint === 'unique_active_session_per_jukebox') {
            throw new InternalServerErrorException(
              'Failed to generate juke session, an active one exists for this jukebox',
            )
          } else if (dbError.constraint === 'unique_join_code') {
            ++retries
            if (retries > MAX_RETRIES) {
              throw new InternalServerErrorException('Failed to generate a unique join code')
            }
          }
        } else {
          throw err
        }
      }
    }

    // For retrieving jukebox club_id on session relation
    const createdSession = await this.jukeSessionRepo.findOne({
      where: { id: session.id },
      relations: {
        jukebox: true,
      },
    })

    if (!createdSession) {
      throw new InternalServerErrorException('Could not get jukebox for QR code creation')
    }

    await this.jukeSessionRepo.update(
      { id: session.id },
      {
        qr_code: await this.generateQrCode(
          createdSession.id,
          jukeboxId,
          createdSession.join_code,
          createdSession.jukebox.club_id,
          token,
        ),
      },
    )

    return await this.findOne(session.id)
  }

  async generateQrCode(
    id: number,
    jukeboxId: number,
    joinCode: string,
    clubId: number,
    token: string,
  ): Promise<string> {
    const link = await this.networkService.sendRequest(
      token,
      `${CLUBS_URL}/api/v1/analytics/links/`,
      'POST',
      {
        target_url: `${BASE_URL}/api/v1/${jukeboxId}/juke-session/${id}/members/?joinCode=${joinCode}`,
        display_name: `Session ${id}`,
        club_id: clubId,
      },
    )

    if (link.status !== 201) {
      throw new InternalServerErrorException(
        'Could not create QR code: ' + link.description + ', ' + link.data,
      )
    }

    const qrCode = await this.networkService.sendRequest(
      token,
      `${CLUBS_URL}/api/v1/analytics/qrcode/`,
      'POST',
      {
        link_id: link.data.id,
      },
    )

    if (qrCode.status !== 201) {
      throw new InternalServerErrorException(
        'Could not create QR code with link: ' + qrCode.description + ', ' + qrCode.data,
      )
    }

    return qrCode.data.image
  }

  async findAll(jukeboxId: number): Promise<JukeSessionDto[]> {
    const sessions = await this.jukeSessionRepo.find({
      where: { jukebox: { id: jukeboxId } },
      relations: { jukebox: true },
    })
    return sessions.map((session) => plainToInstance(JukeSessionDto, session))
  }

  async findOne(id: number): Promise<JukeSessionDto> {
    const session = await this.jukeSessionRepo.findOne({
      where: { id },
      relations: {
        jukebox: true,
      },
    })
    if (!session) {
      throw new NotFoundException(`Juke session not found with id ${id}`)
    }

    return plainToInstance(JukeSessionDto, session)
  }

  async update(id: number, updateJukeSessionDto: UpdateJukeSessionDto): Promise<JukeSessionDto> {
    let currUpdateDto = updateJukeSessionDto
    const session = await this.findOne(id)

    if (!session.is_active) {
      throw new BadRequestException('Cannot modify deactivated juke session')
    }

    if ('is_active' in currUpdateDto) {
      if (
        (session.is_active && !currUpdateDto.is_active) ||
        (currUpdateDto.end_at && currUpdateDto.end_at < new Date())
      ) {
        currUpdateDto = { end_at: new Date(), is_active: false }
      } else if (currUpdateDto.is_active) {
        throw new BadRequestException(
          'Cannot attempt to reactivate juke session once it is deactivated. Create a new one',
        )
      }
    }

    await this.jukeSessionRepo.update({ id }, currUpdateDto)
    return await this.findOne(id)
  }

  async updateNextOrder(id: number, nextOrder: number): Promise<JukeSessionDto> {
    await this.jukeSessionRepo.update({ id }, { next_order: nextOrder })
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

    var createdMembership: JukeSessionMembership
    try {
      createdMembership = await this.membershipRepo.save(preMembership)
    } catch (err) {
      const dbError = err.driverError
      // Checks Postgres Unique Constraint Error Code
      if (err instanceof QueryFailedError && dbError?.code === '23505') {
        if (dbError.constraint === 'unique_user_per_session') {
          throw new InternalServerErrorException(
            'Failed to generate membership, an user_id already exists on this session',
          )
        }
      }
      throw err
    }

    const membership = await this.getMembership(createdMembership.id)
    return membership
  }

  async getMemberships(
    jukeSessionId: number,
    page: number,
    rows: number,
  ): Promise<JukeSessionMembershipCountDto> {
    const membershipsToSkip = page * rows
    const [membershipsData, count] = await this.membershipRepo.findAndCount({
      skip: membershipsToSkip,
      take: rows,
      where: { juke_session: { id: jukeSessionId } },
      relations: { juke_session: true },
      order: { user_id: 'ASC' },
    })

    return {
      memberships: membershipsData.map((membership) =>
        plainToInstance(JukeSessionMembershipDto, membership),
      ),
      count: count,
    }
  }

  async getMembership(membershipId: number): Promise<JukeSessionMembershipDto> {
    const membership = await this.membershipRepo.findOne({
      where: { id: membershipId },
      relations: { juke_session: true, queued_tracks: true },
    })
    if (!membership) {
      throw new NotFoundException(`Juke Session Membership with id ${membershipId} not found`)
    }

    return plainToInstance(JukeSessionMembershipDto, membership)
  }

  async getMembershipForUser(
    jukeSessionId: number,
    userId: number,
  ): Promise<JukeSessionMembershipDto> {
    const membership = await this.membershipRepo.findOne({
      where: { user_id: userId, juke_session: { id: jukeSessionId } },
      relations: { juke_session: true, queued_tracks: true },
    })
    if (!membership) {
      throw new NotFoundException(`User ${userId} is not a member of juke session ${jukeSessionId}`)
    }

    return plainToInstance(JukeSessionMembershipDto, membership)
  }

  async deleteMembership(membershipId: number): Promise<JukeSessionMembershipDto> {
    const membership = await this.getMembership(membershipId)
    await this.membershipRepo.delete({ id: membershipId })

    return membership
  }

  async addJukeSessionMemberByJoinCode(
    joinCode: string,
    payload: CreateJukeSessionMembershipDto,
  ): Promise<JukeSessionMembershipDto> {
    const session = await this.jukeSessionRepo.findOne({ where: { join_code: joinCode } })

    if (!session) {
      throw new NotFoundException('Could Not Find Juke Session for Join Code: ' + joinCode)
    }

    const preMembership = this.membershipRepo.create({
      juke_session: { id: session.id },
      ...payload,
    })
    const membership = await this.membershipRepo.save(preMembership)
    return plainToInstance(JukeSessionMembershipDto, membership)
  }

  // ============================================
  // MARK: Business Logic
  // ============================================

  /**
   * Get Current Juke Session, or throw 404.
   */
  async getCurrentSession(jukeboxId: number): Promise<JukeSessionDto> {
    const session = await this.jukeSessionRepo.findOne({
      where: { jukebox: { id: jukeboxId }, is_active: true },
      relations: { jukebox: true },
    })
    if (!session) {
      throw new NotFoundException(`No Current Juke session Found for jukebox ${jukeboxId}`)
    }

    return plainToInstance(JukeSessionDto, session)
  }

  /**
   * Get current JukeSession or return null.
   */
  async maybeGetCurrentSession(jukeboxId: number): Promise<JukeSessionDto | null> {
    try {
      const session = await this.getCurrentSession(jukeboxId)
      return session
    } catch (e) {
      return null
    }
  }
}
