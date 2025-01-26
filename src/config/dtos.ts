import { ApiProperty } from '@nestjs/swagger'

export class BaseDto {
  @ApiProperty({ readOnly: true })
  id: number

  @ApiProperty({ readOnly: true })
  created_at: string

  @ApiProperty({ readOnly: true })
  updated_at: string

  static serialize(entity: { id: number; created_at: string; updated_at: string }) {
    return { id: entity.id, created_at: entity.created_at, updated_at: entity.updated_at }
  }
}
