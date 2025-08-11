import { Injectable, NotImplementedException } from '@nestjs/common'
import { AccountLinkDto, CreateAccountLinkDto, UpdateAccountLinkDto } from './dto/account-link.dto'

@Injectable()
export class AccountLinkService {
  async create(createAccountLinkDto: CreateAccountLinkDto): Promise<AccountLinkDto> {
    throw new NotImplementedException()
  }

  async findAll(): Promise<AccountLinkDto[]> {
    throw new NotImplementedException()
  }

  async findOne(id: number): Promise<AccountLinkDto> {
    throw new NotImplementedException()
  }

  async update(id: number, updateAccountLinkDto: UpdateAccountLinkDto): Promise<AccountLinkDto> {
    throw new NotImplementedException()
  }

  async remove(id: number): Promise<AccountLinkDto> {
    throw new NotImplementedException()
  }

  async getActiveAccount(jukeboxId: number): Promise<AccountLinkDto> {
    throw new NotImplementedException()
  }
}
