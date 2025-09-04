import { IsNotEmpty, IsString } from 'class-validator'

export class JoinCodeQuery {
  @IsNotEmpty()
  @IsString()
  joinCode: string
}
