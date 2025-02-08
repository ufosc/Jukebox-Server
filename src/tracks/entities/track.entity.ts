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


@Entity()
export class Track {
    @PrimaryGeneratedColumn('uuid')
    track_id: string;
}

