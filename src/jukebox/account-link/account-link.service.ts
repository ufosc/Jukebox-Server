import { Injectable, NotFoundException, NotImplementedException } from '@nestjs/common'
import { AccountLinkDto, CreateAccountLinkDto, UpdateAccountLinkDto } from './dto/account-link.dto'
import { QueryFailedError, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { AccountLink } from './entities/account-link.entity'
import { plainToInstance } from 'class-transformer'

@Injectable()
export class AccountLinkService {
  constructor(@InjectRepository(AccountLink) private accountLinkRepo: Repository<AccountLink>) { }

  async create(jukebox_id: number, createAccountLinkDto: CreateAccountLinkDto): Promise<AccountLinkDto> {
    const preLink = this.accountLinkRepo.create({ ...createAccountLinkDto, jukebox: { id: jukebox_id } })

    let link: AccountLink | null
    try {
      const createdLink = await this.accountLinkRepo.save(preLink)
      link = await this.accountLinkRepo.findOne({
        where: { id: createdLink.id },
        relations: { spotify_account: true },
        loadRelationIds: { relations: ['jukebox'] }
      })
    } catch (err) {
      // Checks Postgres Unique Constraint Error Code
      if (err instanceof QueryFailedError && err.driverError?.code === '23505') {
        link = await this.accountLinkRepo.findOne({
          where: { jukebox: { id: jukebox_id }, spotify_account: { id: createAccountLinkDto.spotify_account.id } },
          relations: { spotify_account: true },
          loadRelationIds: { relations: ['jukebox'] }
        })

        if (!link) {
          throw new NotFoundException("Could not find or create account link")
        }
      } else {
        throw err
      }
    }

    return plainToInstance(AccountLinkDto, link)
  }

  async findAll(jukebox_id: number): Promise<AccountLinkDto[]> {
    const links = await this.accountLinkRepo.find({
      where: { jukebox: { id: jukebox_id } },
      relations: { spotify_account: true },
      loadRelationIds: { relations: ['jukebox'] }
    })
    return plainToInstance(AccountLinkDto, links)
  }

  async findOne(id: number): Promise<AccountLinkDto> {
    const link = await this.accountLinkRepo.findOne({
      where: { id },
      relations: { spotify_account: true },
      loadRelationIds: { relations: ['jukebox'] }
    })
    if (!link) {
      throw new NotFoundException()
    }

    return plainToInstance(AccountLinkDto, link)
  }

  async update(id: number, updateAccountLinkDto: UpdateAccountLinkDto): Promise<AccountLinkDto> {
    await this.accountLinkRepo.update({ id }, updateAccountLinkDto)
    const link = await this.findOne(id)
    return plainToInstance(AccountLinkDto, link)
  }

  async remove(id: number): Promise<AccountLinkDto> {
    const link = this.findOne(id)
    await this.accountLinkRepo.delete({ id })

    return plainToInstance(AccountLinkDto, link)
  }

  async getActiveAccount(jukeboxId: number): Promise<AccountLinkDto> {
    const link = await this.accountLinkRepo.findOne({
      where: { jukebox: { id: jukeboxId }, active: true },
      relations: { spotify_account: true },
      loadRelationIds: { relations: ['jukebox'] }
    })
    return plainToInstance(AccountLinkDto, link)
  }
}
