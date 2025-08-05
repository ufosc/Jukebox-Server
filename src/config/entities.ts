import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity as TypeormBase,
  UpdateDateColumn,
} from 'typeorm'

/**
 * Base Entity Source:
 * https://github.com/typeorm/typeorm/blob/master/src/repository/BaseEntity.ts
 *
 * TypeOrm Docs: https://typeorm.io/docs/entity/entities/
 */

export abstract class EntityBase extends TypeormBase {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @DeleteDateColumn({ nullable: true })
  deleted_on: Date

  serialize() {
    return {
      id: this.id,
      created_at: this.created_at.toISOString(),
      updated_at: this.updated_at.toISOString(),
    }
  }
}
