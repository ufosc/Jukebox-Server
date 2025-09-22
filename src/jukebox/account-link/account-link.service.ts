import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToInstance } from 'class-transformer'
import { SpotifyAuthService } from 'src/spotify/spotify-auth.service'
import { QueryFailedError, Repository } from 'typeorm'
import { AccountLinkDto, CreateAccountLinkDto, UpdateAccountLinkDto } from './dto/account-link.dto'
import { AccountLink } from './entities/account-link.entity'

@Injectable()
export class AccountLinkService {
  constructor(
    private spotifyAuthService: SpotifyAuthService,
    @InjectRepository(AccountLink) private accountLinkRepo: Repository<AccountLink>,
  ) {}

  async create(
    jukebox_id: number,
    createAccountLinkDto: CreateAccountLinkDto,
  ): Promise<AccountLinkDto> {
    const preLink = this.accountLinkRepo.create({
      active: createAccountLinkDto.active,
      spotify_account: { id: createAccountLinkDto.spotify_account_id },
      jukebox: { id: jukebox_id },
    })

    let link: AccountLink | null
    try {
      const createdLink = await this.accountLinkRepo.save(preLink)
      link = await this.accountLinkRepo.findOne({
        where: { id: createdLink.id },
        relations: { spotify_account: true },
        loadRelationIds: { relations: ['jukebox'] },
      })
    } catch (err) {
      // Checks Postgres Unique Constraint Error Code
      if (err instanceof QueryFailedError && err.driverError?.code === '23505') {
        link = await this.accountLinkRepo.findOne({
          where: {
            jukebox: { id: jukebox_id },
            spotify_account: { id: createAccountLinkDto.spotify_account_id },
          },
          relations: { spotify_account: true },
          loadRelationIds: { relations: ['jukebox'] },
        })

        if (!link) {
          throw new NotFoundException('Could not find or create account link')
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
      relations: { spotify_account: true, jukebox: true },
      loadRelationIds: { relations: ['jukebox'] },
    })
    return plainToInstance(AccountLinkDto, links)
  }

  async findOne(id: number): Promise<AccountLinkDto> {
    const link = await this.accountLinkRepo.findOne({
      where: { id },
      relations: { spotify_account: true },
      loadRelationIds: { relations: ['jukebox'] },
    })
    if (!link) {
      throw new NotFoundException()
    }

    return plainToInstance(AccountLinkDto, link)
  }

  async update(id: number, updateAccountLinkDto: UpdateAccountLinkDto): Promise<AccountLinkDto> {
    const payload: any = { active: updateAccountLinkDto.active }
    if (updateAccountLinkDto.spotify_account_id != null) {
      payload.spotify_account = { id: updateAccountLinkDto.spotify_account_id }
    }

    await this.accountLinkRepo.update({ id }, payload)
    const link = await this.findOne(id)
    return plainToInstance(AccountLinkDto, link)
  }

  async remove(id: number): Promise<AccountLinkDto> {
    const link = this.findOne(id)
    await this.accountLinkRepo.delete({ id })

    return plainToInstance(AccountLinkDto, link)
  }

  async refreshAccountLink(accountLink: AccountLink) {
    await this.spotifyAuthService.refreshSpotifyAccount(accountLink.spotify_account)
  }

  async getActiveAccount(jukeboxId: number, refresh?: boolean): Promise<AccountLinkDto> {
    const link = await this.accountLinkRepo.findOne({
      where: { jukebox: { id: jukeboxId }, active: true },
      relations: { spotify_account: true, jukebox: true },
      loadRelationIds: { relations: ['jukebox'] },
    })

    if (!link) {
      throw new NotFoundException('Could not find active account link for jukeboxId: ' + jukeboxId)
    }

    if (refresh) {
      Logger.log(`Refreshing active account link for jukebox ${jukeboxId}...`)
      await this.refreshAccountLink(link)
    }

    return plainToInstance(AccountLinkDto, link)
  }
}
