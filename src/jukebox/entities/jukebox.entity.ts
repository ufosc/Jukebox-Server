import { EntityBase } from 'src/config/entities'
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { AccountLink } from '../account-link/entities/account-link.entity'
import { JukeSession } from '../juke-session/entities/juke-session.entity'

export enum TimeFormat {
  HOUR_12 = '12-hour',
  HOUR_24 = '24-hour',
}

@Entity('jukebox')
export class Jukebox extends EntityBase {
  @Column()
  name: string

  @Column()
  @Index()
  club_id: number

  @Column({ type: 'enum', enum: TimeFormat, default: TimeFormat.HOUR_12 })
  time_format: TimeFormat

  @Column({ default: 5 })
  queue_size: number

  // Foreign Relationships
  @OneToMany(() => AccountLink, (account_link) => account_link.jukebox)
  account_links: AccountLink[]

  @OneToMany(() => JukeSession, (juke_session) => juke_session.jukebox)
  juke_sessions: JukeSession[]
}
