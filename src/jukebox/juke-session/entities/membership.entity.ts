import { EntityBase } from 'src/config/entities'
import { QueuedTrack } from 'src/jukebox/queue/entities/queued-track.entity'
import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm'
import { JukeSession } from './juke-session.entity'

@Entity('juke_session_membership')
@Index('unique_user_per_session', ['juke_session', 'user_id'], { unique: true })
export class JukeSessionMembership extends EntityBase {
  @ManyToOne(() => JukeSession, (juke_session) => juke_session.memberships)
  juke_session: JukeSession

  @Column()
  user_id: number

  @OneToMany(() => QueuedTrack, (queued_track) => queued_track.queued_by)
  queued_tracks: QueuedTrack[]
}
