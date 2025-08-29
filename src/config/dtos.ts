import { ApiProperty } from '@nestjs/swagger'
import { EntityBase } from './entities'

export class EntityDtoBase<T = EntityBase> {
  @ApiProperty({ readOnly: true })
  id: number

  @ApiProperty({ readOnly: true })
  created_at: Date

  @ApiProperty({ readOnly: true })
  updated_at: Date

  // constructor(entity: T) {
  //   Object.assign(this, entity)
  // }
}
