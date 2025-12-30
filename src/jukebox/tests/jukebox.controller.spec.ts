import { NotFoundException } from '@nestjs/common'
import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseModule } from 'src/config/database.module'
import { NetworkService } from 'src/network/network.service'
import { mockUser } from 'src/utils/mock'
import { DataSource } from 'typeorm'
import { Jukebox, TimeFormat } from '../entities/jukebox.entity'
import { JukeboxController } from '../jukebox.controller'
import { JukeboxService } from '../jukebox.service'

describe('JukeboxController', () => {
  let module: TestingModule
  let controller: JukeboxController

  const adminClubId = 20

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule, TypeOrmModule.forFeature([Jukebox])],
      controllers: [JukeboxController],
      providers: [
        JukeboxService,
        {
          provide: NetworkService,
          useValue: {
            sendRequest: jest.fn().mockResolvedValue({
              status: 200,
              description: 'OK',
              data: [{ id: adminClubId, name: 'Test' }],
            }),
          },
        },
      ],
    }).compile()

    controller = module.get<JukeboxController>(JukeboxController)
  })

  afterEach(async () => {
    const datasource = module.get<DataSource>(DataSource)
    await datasource.dropDatabase()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should create a Jukebox for a clubId', async () => {
    const name1 = 'Test1'
    const clubId1 = 1
    const jukebox1 = await controller.create({ name: name1, club_id: clubId1 })
    expect(jukebox1.club_id).toEqual(clubId1)
    expect(jukebox1.name).toEqual(name1)

    const name2 = 'Test2'
    const clubId2 = 2
    const timeFormat2 = TimeFormat.HOUR_24
    const queueSize2 = 10
    const jukebox2 = await controller.create({
      name: name2,
      club_id: clubId2,
      time_format: timeFormat2,
      queue_size: queueSize2,
    })
    expect(jukebox2.club_id).toEqual(clubId2)
    expect(jukebox2.name).toEqual(name2)
    expect(jukebox2.time_format).toEqual(timeFormat2)
    expect(jukebox2.queue_size).toEqual(queueSize2)
  })

  it('should find a jukebox by its id or throw', async () => {
    const name = 'Test'
    const club_id = 4
    const jukebox = await controller.create({ name, club_id })

    const result = await controller.findOne(jukebox.id)
    expect(result.name).toEqual(name)
  })

  // TODO: ADD TESTING OF AUTO CREATION ON CLUB W/O JUKEBOX
  it('should find all jukeboxes with a clubId and create if none exist for admin', async () => {
    const adminResult = await controller.findAll(adminClubId, mockUser)
    expect(adminResult.length).toBeGreaterThanOrEqual(1)
    expect(adminResult[0].club_id).toEqual(adminClubId)

    const name1 = 'FindAll1'
    const clubId1 = 5
    const jukebox1 = await controller.create({ name: name1, club_id: clubId1 })

    const name2 = 'FindAll2'
    const jukebox2 = await controller.create({ name: name2, club_id: clubId1 })

    const result1 = await controller.findAll(clubId1, mockUser)
    expect(result1.length).toBeGreaterThanOrEqual(2)
    expect(result1.some((j) => j.id === jukebox1.id)).toBeTruthy()
    expect(result1.some((j) => j.id === jukebox2.id)).toBeTruthy()

    const result2 = await controller.findAll(123123, mockUser)
    expect(result2.length).toEqual(0)
  })

  it('should update a jukebox', async () => {
    const name = 'Updated'
    const club_id = 6
    const time_format = TimeFormat.HOUR_24
    const queue_size = 10
    const jukebox = await controller.create({
      name,
      club_id,
      time_format,
      queue_size,
    })
    expect(jukebox.name).toEqual(name)
    expect(jukebox.time_format).toEqual(time_format)
    expect(jukebox.queue_size).toEqual(queue_size)

    const updatedName = 'NewName'
    const updatedTimeFormat = TimeFormat.HOUR_12
    const updatedQueueSize = 20
    const updated = await controller.update(jukebox.id, {
      name: updatedName,
      time_format: updatedTimeFormat,
      queue_size: updatedQueueSize,
    })
    expect(updated.name).toEqual(updatedName)
    expect(updated.time_format).toEqual(updatedTimeFormat)
    expect(updated.queue_size).toEqual(updatedQueueSize)
    expect(updated.club_id).toEqual(club_id)
  })

  it('should remove a jukebox', async () => {
    const name = 'removeMe!!'
    const club_id = 10
    const jukebox = await controller.create({ name, club_id })

    await controller.remove(jukebox.id)
    await expect(controller.findOne(jukebox.id)).rejects.toThrow(NotFoundException)
  })
})
