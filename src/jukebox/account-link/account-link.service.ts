import { Injectable, NotImplementedException } from '@nestjs/common'
import { AccountLinkDto, CreateAccountLinkDto, UpdateAccountLinkDto } from './dto/account-link.dto'

@Injectable()
export class AccountLinkService {
  create(createAccountLinkDto: CreateAccountLinkDto) {
    return 'This action adds a new accountLink'
  }

  findAll() {
    return `This action returns all accountLink`
  }

  findOne(id: number) {
    return `This action returns a #${id} accountLink`
  }

  update(id: number, updateAccountLinkDto: UpdateAccountLinkDto) {
    return `This action updates a #${id} accountLink`
  }

  remove(id: number) {
    return `This action removes a #${id} accountLink`
  }

  async getActiveAccount(jukeboxId: number): Promise<AccountLinkDto> {
    throw new NotImplementedException()
  }
}
