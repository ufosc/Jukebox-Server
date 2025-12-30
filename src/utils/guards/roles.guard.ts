import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { CLUBS_URL, NODE_ENV } from 'src/config'
import { JukeboxService } from 'src/jukebox/jukebox.service'
import { NetworkService } from 'src/network/network.service'
import { Role } from '../decorators/roles.decorator'
import { TokenGuard } from './token.guard'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private jukeboxService: JukeboxService,
    private networkService: NetworkService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (!TokenGuard.checkToken(context, this.networkService)) return false

    if (NODE_ENV === 'dev') {
      return true
    }

    const role = this.reflector.get<Role>('roles', context.getHandler())
    if (!role) throw new InternalServerErrorException('Role Guard Must Have A Valid Role')

    const request = context.switchToHttp().getRequest()
    const { body, query, params } = request
    let clubId = body?.club_id ?? query?.club_id ?? params?.club_id ?? null
    const [_, token] = request.headers.authorization?.split(' ') ?? []

    if (clubId === null) {
      const jukeboxId = params?.jukebox_id ?? query?.jukeboxId ?? null

      if (!jukeboxId) {
        throw new BadRequestException('Must include jukebox_id or club_id in this request')
      }

      const jukebox = await this.jukeboxService.findOne(jukeboxId)
      clubId = jukebox.club_id
    }

    const clubs = (await this.networkService.sendRequest(
      token,
      `${CLUBS_URL}/api/v1/club/clubs/${role === 'admin' ? '?is_admin=true' : ''}`,
      'GET',
    )) as { status: number; description: string; data: { id: number; name: string }[] }

    if (clubs.status !== 200) {
      return false
    }

    return !!clubs.data.find((m) => m.id == clubId)
  }
}
