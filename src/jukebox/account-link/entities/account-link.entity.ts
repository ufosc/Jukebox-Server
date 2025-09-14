import { EntityBase } from 'src/config/entities'
import { SpotifyAccount } from 'src/spotify/entities/spotify-account.entity'
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'
import { Jukebox } from '../../entities/jukebox.entity'

@Entity('account_link')
@Index('unique_account_link_pair', ['jukebox', 'spotify_account'], { unique: true })
export class AccountLink extends EntityBase {
  @Column()
  jukebox_id: number

  @ManyToOne(() => Jukebox, (jukebox) => jukebox.account_links)
  @JoinColumn({ name: 'jukebox_id' })
  jukebox: Jukebox

  @ManyToOne(() => SpotifyAccount, (spotify_account) => spotify_account.account_links)
  spotify_account: SpotifyAccount

  @Column({ default: true })
  active: boolean
}
