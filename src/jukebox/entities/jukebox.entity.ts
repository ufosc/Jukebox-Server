import { BaseEntity } from 'src/config/entities'
import { SpotifyLink } from 'src/spotify/entities/spotify-link.entity'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('jukebox')
export class Jukebox extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  club_id: number

  @OneToMany(() => JukeboxSpotifyLinkAssignment, (assignment) => assignment.jukebox)
  spotify_link_assignments: JukeboxSpotifyLinkAssignment[]
}

@Entity('jukebox_spotify_link_assignment')
export class JukeboxSpotifyLinkAssignment extends BaseEntity {
  @PrimaryColumn({ name: 'jukebox_id' })
  jukebox_id: number

  @ManyToOne(() => Jukebox, (jukebox) => jukebox.spotify_link_assignments)
  @JoinColumn({ name: 'jukebox_id' })
  jukebox: Jukebox

  @PrimaryColumn({ name: 'spotify_link_id' })
  spotify_link_id: number

  @ManyToOne(() => SpotifyLink, (link) => link.jukebox_assignments)
  @JoinColumn({ name: 'spotify_link_id' })
  spotify_link: SpotifyLink

  @Column({ default: false })
  active: boolean
}
