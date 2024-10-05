import { Module } from '@nestjs/common';
import { SpotifyController } from './spotify.controller';
import { SpotifyService } from './spotify.service';

@Module({
  controllers: [SpotifyController],
  providers: [SpotifyService]
})
export class SpotifyModule {}
