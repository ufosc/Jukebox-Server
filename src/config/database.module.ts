import { Global, Logger, Module } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER } from './constants'

export const getDb = () => {
  return new DataSource({
    type: 'postgres',
    host: DB_HOST,
    port: DB_PORT,
    password: DB_PASS,
    username: DB_USER,
    entities: [`${__dirname}/../**/**.entity{.ts,.js}`],
    database: DB_NAME,
    synchronize: true, // TODO: Setup production migrations
    logging: false,
  })
}

@Global()
@Module({
  imports: [],
  exports: [DataSource],
  providers: [
    {
      provide: DataSource,
      inject: [],
      useFactory: async () => {
        try {
          const db = getDb()
          await db.initialize()
          Logger.log('Database connected successfully.', 'Config Database')

          return db
        } catch (e) {
          Logger.error(`Error connecting to the database: ${e}`, 'Config Database')
        }
      },
    },
  ],
})
export class DatabaseModule {}
