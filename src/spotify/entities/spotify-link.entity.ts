import { BaseEntity } from 'src/config/entities'
import { JukeboxSpotifyLinkAssignment } from 'src/jukebox/entities/jukebox.entity'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity('spotify_link')
export class SpotifyLinkEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  access_token: string

  @Column()
  refresh_token: string

  @Column()
  user_id: string

  @Column()
  spotify_email: string

  @Column()
  expires_in: number

  @Column()
  expires_at: Date

  @Column()
  token_type: string

  @OneToMany(() => JukeboxSpotifyLinkAssignment, (assignment) => assignment.spotify_link)
  jukebox_assignments: JukeboxSpotifyLinkAssignment[]

  isExpired() {
    return this.expires_at.getTime() <= Date.now()
  }

  syncExpiresAt() {
    this.expires_at = new Date(Date.now() + this.expires_in * 1000)
  }
}
