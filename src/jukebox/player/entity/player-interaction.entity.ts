import { EntityBase } from 'src/config/entities'
import { QueuedTrack } from 'src/jukebox/queue/entities/queued-track.entity'
import { Column, Entity, ManyToOne } from 'typeorm'

export enum InteractionType {
  LIKE = 'like',
  DISLIKE = 'dislike',
}

@Entity('player_interaction')
export class PlayerInteraction extends EntityBase {
  @ManyToOne(() => QueuedTrack, (track) => track.interactions)
  queued_track: QueuedTrack

  @Column()
  user_id: number

  @Column({ type: 'enum', enum: InteractionType })
  interaction_type: InteractionType
}
