import { Expose } from 'class-transformer'
import { IsEnum } from 'class-validator'
import { InteractionType } from '../entity/player-interaction.entity'

export class CreatePlayerInteractionDto {
  @Expose()
  @IsEnum(InteractionType)
  interaction_type: InteractionType
}
