import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SpotifyModule } from '../spotify/spotify.module'
import { Jukebox, JukeboxLinkAssignment } from './entities/jukebox.entity'
import { JukeboxController } from './jukebox.controller'
import { JukeboxService } from './jukebox.service'

@Module({
  controllers: [JukeboxController],
  providers: [JukeboxService],
  imports: [
    // MongooseModule.forFeature([{ name: Jukebox.name, schema: JukeboxSchema }]),
    TypeOrmModule.forFeature([Jukebox, JukeboxLinkAssignment]),
    SpotifyModule,
  ],
  exports: [JukeboxService],
})
export class JukeboxModule {}
