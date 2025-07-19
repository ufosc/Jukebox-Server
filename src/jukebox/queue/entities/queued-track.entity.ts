import { EntityBase } from 'src/config/entities'
import { JukeSessionMembership } from 'src/jukebox/juke-session/entities/membership.entity'
import {
  InteractionType,
  PlayerInteraction,
} from 'src/jukebox/player/entity/player-interaction.entity'
import { Track } from 'src/track/entities/track.entity'
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm'

@Entity('queued_track')
export class QueuedTrack extends EntityBase {
  @ManyToOne(() => JukeSessionMembership, (membership) => membership.queued_tracks)
  queued_by: JukeSessionMembership

  @ManyToOne(() => Track)
  track: Track

  @OneToMany(() => PlayerInteraction, (interaction) => interaction.queued_track)
  interactions: PlayerInteraction[]

  @Column({ default: false })
  played: boolean

  @Column({ nullable: true })
  played_at?: Date

  @Column({ nullable: true })
  played_order?: number

  @Column({ default: true })
  is_editable: boolean

  get likes() {
    return this.interactions.filter(
      (interaction) => interaction.interaction_type === InteractionType.LIKE,
    ).length
  }

  get dislikes() {
    return this.interactions.filter(
      (interaction) => interaction.interaction_type === InteractionType.DISLIKE,
    ).length
  }
}
