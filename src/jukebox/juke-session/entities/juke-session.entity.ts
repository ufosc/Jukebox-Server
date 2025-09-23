import { EntityBase } from 'src/config/entities'
import { Jukebox } from 'src/jukebox/entities/jukebox.entity'
import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm'
import { JukeSessionMembership } from './membership.entity'

@Entity('juke_session')
@Index('unique_active_session_per_jukebox', ['jukebox'], {
  unique: true,
  where: `"is_active" = true`,
})
export class JukeSession extends EntityBase {
  @ManyToOne(() => Jukebox, (jukebox) => jukebox.juke_sessions)
  jukebox: Jukebox

  @Index('unique_join_code', ['join_code'], { unique: true })
  @Column()
  join_code: string

  @Column({ default: '' })
  qr_code: string

  @Column({ default: 1 })
  next_order: number

  @Column()
  start_at: Date

  @Column()
  end_at: Date

  @Column({ default: true })
  is_active: boolean

  // Foreign Relationships
  @OneToMany(() => JukeSessionMembership, (membership) => membership.juke_session)
  memberships: JukeSessionMembership
}
