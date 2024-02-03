import { Group, Membership, type User } from 'src/models'
import { AuthService } from '../authService'
import { GroupService } from '../groupService'

const createGroup = async (owner: User): Promise<Group> => {
  return await GroupService.createGroup(owner, 'Example Group')
}

describe('Group service, Group initialization', () => {
  it('should create group', async () => {
    const owner = await AuthService.registerUser({ email: 'owner@example.com', password: 'abc123' })
    const groupName = 'Example Group'

    const group = await GroupService.createGroup(owner, groupName)

    expect(String(group.ownerId)).toEqual(String(owner._id))
    expect(group.name).toEqual(groupName)
    expect(group.memberCount).toEqual(1)

    const members = await Membership.find({ groupId: group._id })
    expect(members).toHaveLength(1)
    expect(String(members[0].userId)).toEqual(String(owner._id))
  })
})

describe('Group service, Group management', () => {
  let owner: User
  let group: Group

  beforeEach(async () => {
    owner = await AuthService.registerUser({ email: 'owner@example.com', password: 'abc123' })
    group = await createGroup(owner)
  })

  it('should create group member', async () => {
    const user = await AuthService.registerUser({
      email: 'john.doe@example.com',
      password: 'abc123'
    })

    const membership = await GroupService.registerGroupMember(group, user)

    expect(String(membership.groupId)).toEqual(String(group._id))
    expect(String(membership.userId)).toEqual(String(user._id))
    expect(membership.role).toEqual('member')
    expect(membership.points).toEqual(0)
  })
  it('should create group member with role', async () => {
    const role = 'admin'
    const user = await AuthService.registerUser({
      email: 'john.doe@example.com',
      password: 'abc123'
    })

    const membership = await GroupService.registerGroupMember(group, user, { role })

    expect(String(membership.groupId)).toEqual(String(group._id))
    expect(String(membership.userId)).toEqual(String(user._id))
    expect(membership.role).toEqual(role)
    expect(membership.points).toEqual(0)
  })

  it('should delete group', async () => {
    const pre = await Group.find({})
    expect(pre).toHaveLength(1)

    await GroupService.deleteGroup(group)

    const post = await Group.find({})
    expect(post).toHaveLength(0)

    const members = await Membership.find({ groupId: group._id })
    expect(members).toHaveLength(0)
  })
  it('should get group members', async () => {
    for (let i = 0; i < 5; i++) {
      const user = await AuthService.registerUser({
        email: `user${i}@example.com`,
        password: 'abc123'
      })
      await GroupService.registerGroupMember(group, user)
    }

    const members = await GroupService.getGroupMembers(group)
    expect(members).toHaveLength(6) // 5 members + owner
  })
})
