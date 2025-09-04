import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import type { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from 'src/app.module'
import { RolesGuard } from 'src/utils/guards/roles.guard'
import { Reflector } from '@nestjs/core'
import { DatabaseModule } from 'src/config/database.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Jukebox } from 'src/jukebox/entities/jukebox.entity'
import { JukeboxService } from 'src/jukebox/jukebox.service'
import { NetworkService } from 'src/network/network.service'
import { AxiosProvider } from 'src/utils/mock'
import { Axios } from 'axios'

describe('AppController (e2e)', () => {
  let app: INestApplication
  let guard: RolesGuard
  let reflector: Reflector
  let jukeboxService: JukeboxService
  let networkService: NetworkService

  const networkMock = {
    sendRequest: jest
      .fn()
      .mockResolvedValueOnce({
        status: 200,
        description: 'test',
        data: [{ id: 0, name: 'Baby' }],
      })
      .mockResolvedValueOnce({
        status: 200,
        description: 'test',
        data: [{ id: 0, name: 'Baby' }],
      })
      .mockResolvedValueOnce({
        status: 200,
        description: 'test',
        data: [],
      })
      .mockResolvedValueOnce({
        status: 200,
        description: 'test',
        data: [{ id: 0, name: 'Baby' }],
      }),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(NetworkService)
      .useValue(networkMock)
      .compile()

    app = module.createNestApplication()
    await app.init()

    jukeboxService = module.get<JukeboxService>(JukeboxService)
    networkService = module.get<NetworkService>(NetworkService)

    reflector = new Reflector()
    guard = new RolesGuard(jukeboxService, networkService, reflector)
  })

  it('/ (GET)', async () => {
    await request(app.getHttpServer())
      .get('/')
      .expect({ status: 200, message: 'Jukebox Server is online' })
  })

  it('role guard should work correctly', async () => {
    const jukeboxResult = await request(app.getHttpServer())
      .post('/jukebox/jukeboxes')
      .set('Authorization', 'Bearer ADMIN_TOKEN')
      .send({
        name: 'Baby',
        club_id: 0,
        time_format: '12-hour',
        queue_size: 10,
      })
    expect(jukeboxResult.status).toBe(201)

    const findAllJukeboxResult = await request(app.getHttpServer())
      .get('/jukebox/jukeboxes/?clubId=0')
      .set('Authorization', 'Bearer MEMBER_TOKEN')
    expect(findAllJukeboxResult.status).toBe(200)

    const jukeboxResultError = await request(app.getHttpServer())
      .post('/jukebox/jukeboxes')
      .set('Authorization', 'Bearer MEMBER_TOKEN')
      .send({
        name: 'Adult',
        club_id: 1,
        time_format: '12-hour',
        queue_size: 10,
      })
    expect(jukeboxResultError.status).toBe(403)

    const deleteJukeboxResult = await request(app.getHttpServer())
      .delete(`/jukebox/jukeboxes/${jukeboxResult.body.id}`)
      .set('Authorization', 'Bearer ADMIN_TOKEN')
    expect(deleteJukeboxResult.status).toBe(200)
  })
})
