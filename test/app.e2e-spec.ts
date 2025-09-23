import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import type { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from 'src/app.module'
import { NetworkService } from 'src/network/network.service'
import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'
import { JukeboxService } from 'src/jukebox/jukebox.service'
import type { JukeboxDto } from 'src/jukebox/dto/jukebox.dto'

const connectSocket = (url: string, handshakeData: Object): Promise<Socket> => {
  return new Promise<Socket>((resolve, _) => {
    const socket = io(url, { autoConnect: true, transports: ['websocket'], ...handshakeData })
    socket.once('connect', () => resolve(socket))
    socket.once('connect_error', (err) => {
      console.log(err)
      resolve(socket)
    })
  })
}

const disconnectSocket = (socket: Socket): Promise<Socket> => {
  return new Promise<Socket>((resolve, _) => {
    socket.once('disconnect', () => resolve(socket))
    socket.disconnect()
  })
}

describe('AppController (e2e)', () => {
  let app: INestApplication

  let jukeboxService: JukeboxService

  let jukebox: JukeboxDto

  const networkMock = {
    sendRequest: jest
      .fn()
      // GUARDS

      // For jukebox result
      .mockResolvedValueOnce({
        status: 200,
        description: 'test',
        data: [{ id: 0, name: 'Baby', testingData: 'create' }],
      })
      // For find all result
      .mockResolvedValueOnce({
        status: 200,
        description: 'test',
        data: [{ id: 0, name: 'Baby', testingData: 'findAll' }],
      })
      // For jukebox error result
      .mockResolvedValueOnce({
        status: 200,
        description: 'test',
        data: [{ testingData: 'error' }],
      })
      // For jukebox delete result
      .mockResolvedValueOnce({
        status: 200,
        description: 'test',
        data: [{ id: 0, name: 'Baby', testingData: 'delete' }],
      })

      // SOCKETS

      // For member
      .mockResolvedValueOnce({
        status: 200,
        description: 'test',
        data: [{ id: 0, name: 'Baby' }],
      })
      // For admin
      .mockResolvedValueOnce({
        status: 200,
        description: 'test',
        data: [{ id: 0, name: 'Baby' }],
      })
      // For not part of club
      .mockResolvedValueOnce({
        status: 200,
        description: 'test',
        data: [],
      }),

    setToken: jest.fn().mockImplementation(() => {}),
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
    await app.listen(0)

    jukeboxService = module.get<JukeboxService>(JukeboxService)
    jukebox = await jukeboxService.create({ name: 'WS Test', club_id: 0 })
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

  it('player WS should function correctly', async () => {
    const url = await app.getUrl()
    const memberSocket: Socket = await connectSocket(url, {
      auth: {
        token: 'MEMBER_TOKEN',
      },
      query: {
        role: 'member',
        jukeboxId: jukebox.id,
      },
    })
    expect(memberSocket.connected).toBe(true)

    const adminSocket: Socket = await connectSocket(url, {
      auth: {
        token: 'ADMIN_TOKEN',
      },
      query: {
        role: 'admin',
        jukeboxId: jukebox.id,
      },
    })
    expect(adminSocket.connected).toBe(true)

    const failureSocket1: Socket = await connectSocket(url, {
      auth: {
        token: '',
      },
      query: {
        role: 'admin',
        jukeboxId: jukebox.id,
      },
    })
    expect(failureSocket1.connected).toBe(false)

    const failureSocket2: Socket = await connectSocket(url, {
      auth: {
        token: 'ADMIN_TOKEN',
      },
      query: {
        role: '',
        jukeboxId: jukebox.id,
      },
    })
    expect(failureSocket2.connected).toBe(false)

    const wrongPermission: Socket = await connectSocket(url, {
      auth: {
        token: 'MEMBER_TOKEN',
      },
      query: {
        role: 'admin',
        jukeboxId: jukebox.id,
      },
    })
    expect(wrongPermission.connected).toBe(false)

    const notAllowedResult = await new Promise<string>((resolve, _) => {
      memberSocket.once('exception', () => resolve('failure'))
      memberSocket.once('player-state-update', () => resolve('success'))
      memberSocket.emit('player-aux-update', { jukebox_id: jukebox.id, action: 'paused' })
    })
    expect(notAllowedResult).toContain('failure')

    await disconnectSocket(memberSocket)
    await disconnectSocket(adminSocket)
  })
})
