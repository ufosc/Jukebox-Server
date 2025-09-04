import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { CacheOptions } from 'src/config/cache-options'
import { DatabaseModule } from 'src/config/database.module'
import { JukeboxModule } from 'src/jukebox/jukebox.module'
import { JukeboxService } from 'src/jukebox/jukebox.service'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync(CacheOptions),
    DatabaseModule,
    JukeboxModule,
  ],
})
export class SeedModule {}

const bootstrap = async () => {
  NestFactory.createApplicationContext(SeedModule).then((appContext) => {
    const jukeboxService = appContext.get(JukeboxService)
    jukeboxService.create({ club_id: 1, name: 'Test Jukebox' })
    appContext.close()

    process.exit(0)
  })
}
bootstrap()
