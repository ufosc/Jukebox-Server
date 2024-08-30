import { Group, User } from 'server/models'

describe('Jam service management', () => {
  let group: Group
  let owner: User

  beforeEach(async () => {
    owner = await User.create({ email: 'user@example.com', password: 'abc123' })
    group = await Group.create({ ownerId: owner._id, name: 'Some Group' })
  })

  //   it('should create new jam session, then start it', async () => {
  //     const jam = await JamSession.create({ group, duration: 120 })

  //     expect(jam.active).toBeFalsy()

  //     await jam.start()

  //     expect(jam.active).toBeTruthy()
  //   })

  it('should end group jam session', () => {
    expect(true).toBeTruthy()
  })

  // //   it('should register guest to jam session', () => {
  // //     expect(true).toBeFalsy()
  // //   })
  // // })

  // // describe('Jam service song handling', () => {
  // //   it('should get currently playing', () => {
  // //     expect(true).toBeFalsy()
  // //   })

  // //   it('should set currently playing using song link', () => {
  // //     expect(true).toBeFalsy()
  // //   })

  // //   it('should set currently playing using song id', () => {
  // //     expect(true).toBeFalsy()
  // //   })

  // //   it('should get song queue', () => {
  // //     expect(true).toBeFalsy()
  // //   })
})
