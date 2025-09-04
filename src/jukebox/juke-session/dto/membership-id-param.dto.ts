import { IsNotEmpty, IsNumber } from "class-validator";

export class MembershipIdParam {
    @IsNotEmpty()
    @IsNumber()
    membershipId: number
}