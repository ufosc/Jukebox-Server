import { ApiProperty } from '@nestjs/swagger'

export class BaseDto {
  @ApiProperty({ readOnly: true })
  id: number

  @ApiProperty({ readOnly: true })
  created_at: Date

  @ApiProperty({ readOnly: true })
  updated_at: Date

  static serialize(entity: { id: number; created_at: Date; updated_at: Date }) {
    return { id: entity.id, created_at: entity.created_at, updated_at: entity.updated_at }
  }
}
