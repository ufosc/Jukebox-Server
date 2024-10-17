import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SpotifyModule } from '../spotify/spotify.module'
import { Jukebox, JukeboxSpotifyLinkAssignment } from './entities/jukebox.entity'
import { JukeboxController } from './jukebox.controller'
import { JukeboxService } from './jukebox.service'

@Module({
  controllers: [JukeboxController],
  providers: [JukeboxService],
  imports: [
    // MongooseModule.forFeature([{ name: Jukebox.name, schema: JukeboxSchema }]),
    TypeOrmModule.forFeature([Jukebox, JukeboxSpotifyLinkAssignment]),
    SpotifyModule,
  ],
  exports: [JukeboxService],
})
export class JukeboxModule {}
