import { Injectable, CanActivate, ExecutionContext, BadRequestException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { CLUBS_URL, NODE_ENV } from 'src/config';
import { NetworkService } from 'src/network/network.service';

@Injectable()
export class IsAdminGuard implements CanActivate {
    constructor(private networkService: NetworkService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        if (NODE_ENV === 'dev') {
            return true
        }
        if (!this.networkService.isToken()) {
            return false;
        }

        const request = context.switchToHttp().getRequest()
        const { body, query } = request
        let clubId = null

        if (body && body.club_id) {
            clubId = body.club_id
        }
        if (query && query.clubId) {
            clubId = query.clubId
        }
        if (!clubId) return false

        const clubs = await this.networkService.sendRequest(
            `${CLUBS_URL}/api/v1/club/clubs/?is_admin=true`,
            "GET",
        ) as { status: number, description: string, data: { id: number, name: string }[] }

        if (clubs.status !== 200) {
            return false
        }

        return !!clubs.data.find((m) => m.id == clubId)
    }
}