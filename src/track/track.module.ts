import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Track } from './entities/track.entity'
import { TrackController } from './track.controller'
import { TrackService } from './track.service'

@Module({
  imports: [TypeOrmModule.forFeature([Track])],
  controllers: [TrackController],
  providers: [TrackService],
  exports: [TrackService]
})
export class TrackModule {}
