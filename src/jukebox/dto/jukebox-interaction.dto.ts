import { ApiProperty } from '@nestjs/swagger'

export class CreateJukeboxInteractionDto implements IJukeboxInteractionCreate {
  @ApiProperty({ enum: ['like', 'dislike'] })
  action: 'like' | 'dislike'
  queue_index: number
}

export class UserDto implements IUser {
  email: string
  first_name?: string | undefined
  last_name?: string | undefined
  username: string
  image?: string | undefined
  id: number
  created_at: string
  updated_at: string
}

export class JukeboxInteractionDto
  extends CreateJukeboxInteractionDto
  implements IJukeboxInteraction
{
  jukebox_id: number
  user: UserDto
}
