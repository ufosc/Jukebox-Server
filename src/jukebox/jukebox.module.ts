import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { SpotifyModule } from '../spotify/spotify.module'
import { JukeboxController } from './jukebox.controller'
import { JukeboxService } from './jukebox.service'
import { Jukebox, JukeboxSchema } from './schemas/jukebox.schema'

@Module({
  controllers: [JukeboxController],
  providers: [JukeboxService],
  imports: [
    MongooseModule.forFeature([{ name: Jukebox.name, schema: JukeboxSchema }]),
    SpotifyModule,
  ],
})
export class JukeboxModule {}
