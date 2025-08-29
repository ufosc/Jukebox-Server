import { Expose } from 'class-transformer'
import { IsEnum } from 'class-validator'

export enum ActionType {
  PLAY = 'play',
  PAUSE = 'pause',
  NEXT = 'next',
  PREVIOUS = 'previous',
  LOOP = 'loop',
}

export class PlayerActionDto {
  @Expose()
  @IsEnum(ActionType)
  action_type: ActionType
}
