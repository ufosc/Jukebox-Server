import { EntityBase } from 'src/config/entities'
import { SpotifyAccount } from 'src/spotify/entities/spotify-account.entity'
import { Column, Entity, ManyToOne } from 'typeorm'
import { Jukebox } from '../../entities/jukebox.entity'

@Entity('account_link')
export class AccountLink extends EntityBase {
  @ManyToOne(() => Jukebox, (jukebox) => jukebox.account_links)
  jukebox: Jukebox

  @ManyToOne(() => SpotifyAccount, (spotify_account) => spotify_account.account_links)
  spotify_account: SpotifyAccount

  @Column({ default: true })
  active: boolean
}
