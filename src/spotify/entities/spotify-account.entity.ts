import { BaseEntity } from 'src/config/entities'
import { JukeboxLinkAssignment } from 'src/jukebox/entities/jukebox.entity'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity('spotify_link')
export class SpotifyAccount extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  access_token: string

  @Column()
  refresh_token: string

  @Column()
  user_id: number

  @Column()
  spotify_email: string

  @Column()
  expires_in: number

  @Column()
  expires_at: string

  @Column()
  token_type: string

  @OneToMany(() => JukeboxLinkAssignment, (assignment) => assignment.spotify_link)
  jukebox_assignments: JukeboxLinkAssignment[]

  isExpired() {
    return new Date(this.expires_at).getTime() <= Date.now()
  }

  syncExpiresAt() {
    this.expires_at = new Date(Date.now() + this.expires_in * 1000).toISOString()
  }
}

export const isSpotifyLink = (obj: any): obj is SpotifyAccount => {
  return Object.keys(obj).includes('id')
}
