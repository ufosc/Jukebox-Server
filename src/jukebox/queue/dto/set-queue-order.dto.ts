import { ArrayNotEmpty, IsArray, IsNumber } from 'class-validator'

export class SetQueueOrderDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  ordering: number[]
}
