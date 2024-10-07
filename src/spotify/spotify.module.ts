import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import Axios from 'axios'
import { SpotifyLink, SpotifyLinkSchema } from './schemas/spotify-link.schema'
import { SpotifyController } from './spotify.controller'
import { SpotifyService } from './spotify.service'

@Module({
  controllers: [SpotifyController],
  providers: [
    SpotifyService,
    {
      provide: Axios.Axios,
      useValue: Axios.create(),
    },
  ],
  imports: [MongooseModule.forFeature([{ name: SpotifyLink.name, schema: SpotifyLinkSchema }])],
})
export class SpotifyModule {}
