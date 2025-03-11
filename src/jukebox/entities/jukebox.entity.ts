import { BaseEntity } from 'src/config/entities'
import { SpotifyAccount } from 'src/spotify/entities/spotify-account.entity'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { JukeboxLinkDto } from '../dto/jukebox-link.dto'
import { JukeboxDto } from '../dto/jukebox.dto'

@Entity('jukebox')
export class Jukebox extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  club_id: number

  @OneToMany(() => JukeboxLinkAssignment, (assignment) => assignment.jukebox)
  link_assignments: JukeboxLinkAssignment[]

  serialize(): JukeboxDto {
    return {
      ...super.serialize(),
      name: this.name,
      club_id: this.club_id,
      links: this.link_assignments?.map((assignment) => assignment.serialize()) ?? [],
    }
  }
}

@Entity('jukebox_link_assignment')
export class JukeboxLinkAssignment extends BaseEntity {
  @PrimaryColumn({ name: 'jukebox_id' })
  jukebox_id: number

  @ManyToOne(() => Jukebox, (jukebox) => jukebox.link_assignments)
  @JoinColumn({ name: 'jukebox_id' })
  jukebox: Jukebox

  @PrimaryColumn({ name: 'spotify_link_id' })
  spotify_link_id: number

  @ManyToOne(() => SpotifyAccount, (link) => link.jukebox_assignments)
  @JoinColumn({ name: 'spotify_link_id' })
  spotify_link: SpotifyAccount // TODO: Rename to spotify_account

  @Column({ default: false })
  active: boolean

  serialize(): JukeboxLinkDto {
    return {
      ...super.serialize(),
      type: 'spotify',
      email: this.spotify_link.spotify_email,
      active: this.active,
    }
  }
}
