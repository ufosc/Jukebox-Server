import { IsEnum, IsNotEmpty } from 'class-validator'
import { InteractionType } from '../entity/player-interaction.entity'

export class CreatePlayerInteractionDto {
  @IsNotEmpty()
  @IsEnum(InteractionType)
  interaction_type: InteractionType
}
