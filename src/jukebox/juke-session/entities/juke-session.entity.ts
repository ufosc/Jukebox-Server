import { EntityBase } from 'src/config/entities'
import { Jukebox } from 'src/jukebox/entities/jukebox.entity'
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm'
import { JukeSessionMembership } from './membership.entity'

@Entity('juke_session')
export class JukeSession extends EntityBase {
  @ManyToOne(() => Jukebox, (jukebox) => jukebox.juke_sessions)
  jukebox: Jukebox

  @Column({ unique: true })
  join_code: string

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
