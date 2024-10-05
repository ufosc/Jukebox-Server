import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { SpotifyLink, SpotifyLinkSchema } from './schemas/spotify-link.schema'
import { SpotifyController } from './spotify.controller'
import { SpotifyService } from './spotify.service'

@Module({
  controllers: [SpotifyController],
  providers: [SpotifyService],
  imports: [MongooseModule.forFeature([{ name: SpotifyLink.name, schema: SpotifyLinkSchema }])],
})
export class SpotifyModule {}
