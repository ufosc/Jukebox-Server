import {
  BaseEntity as TypeormBase,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

/**
 * Base Entity Source:
 * https://github.com/typeorm/typeorm/blob/master/src/repository/BaseEntity.ts
 */
export class BaseEntity extends TypeormBase {
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
      created_at: this.created_at,
      updated_at: this.updated_at,
    }
  }
}
