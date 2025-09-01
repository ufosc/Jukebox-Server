import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { NODE_ENV } from "src/config";
import { NetworkService } from "src/network/network.service";
import { Request } from "express";

@Injectable()
export class TokenGuard implements CanActivate {
    constructor(private networkService: NetworkService) { }

    canActivate(context: ExecutionContext): boolean {
        if (NODE_ENV === 'dev') {
            return true
        }

        const request: Request = context.switchToHttp().getRequest()
        const [_, token] = request.headers.authorization?.split(' ') ?? []

        if (!token) return false

        this.networkService.setToken(token)
        return true
    }
}