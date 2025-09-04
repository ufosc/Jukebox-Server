import { IsEnum } from 'class-validator'

export enum ActionType {
  PLAY = 'play',
  PAUSE = 'pause',
  NEXT = 'next',
  PREVIOUS = 'previous',
  LOOP = 'loop',
}

export class PlayerActionDto {
  @IsEnum(ActionType)
  action_type: ActionType
}
