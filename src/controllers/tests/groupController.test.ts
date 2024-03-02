import type { Request, Response } from 'express'
import httpMocks from 'node-mocks-http'
import { Group, User } from 'src/models'
import { AuthService, GroupService } from 'src/services'

import { getMockResJson } from 'src/utils/testing'
import * as controller from '../groupController'

const createUser = async (): Promise<User> => {
  return await AuthService.registerUser({ email: 'john.doe@example.com', password: 'abc123' })
}

describe('Group controller, without group', () => {
  let req: Request
  let res: Response

  beforeEach(async () => {
    res = httpMocks.createResponse({ locals: {} })
  })

  it('should create group', async () => {
    const pre = await Group.find({})
    expect(pre).toHaveLength(0)

    const groupName = 'Example Group'
    const user = await createUser()
    const token = await AuthService.generateToken(user)

    req = httpMocks.createRequest({
      method: 'POST',
      body: {
        name: groupName
      },
      headers: {
        authorization: `Bearer ${token}`
      }
    })

    res.locals = { user }

    const resData = await controller.createGroup(req, res)
    expect(resData.statusCode).toBe(201)

    const body = getMockResJson(resData)
    expect(body).toHaveProperty('ownerId')
    expect(String(body.ownerId)).toEqual(String(user._id))
  })
})

describe('Group controller', () => {
  let req: Request
  let res: Response
  let group: Group
  let owner: User
  let defaultReqOptions: { headers: { authorization: string } }

  beforeEach(async () => {
    owner = await AuthService.registerUser({ email: 'owner@example.com', password: 'abc123' })

    res = httpMocks.createResponse({ locals: { user: owner } })
    group = await GroupService.createGroup(owner, 'Example Group')

    const token = await AuthService.generateToken(owner)
    defaultReqOptions = { headers: { authorization: `Bearer ${token}` } }
  })

  it('should create group member, existing user', async () => {
    const user = await createUser()

    req = httpMocks.createRequest({
      ...defaultReqOptions,
      method: 'POST',
      params: {
        groupId: String(group._id)
      },
      body: {
        email: user.email
      }
    })

    const resData = await controller.createGroupMember(req, res)
    expect(resData.statusCode).toBe(201)
    const body = getMockResJson(resData)

    expect(body).toHaveProperty('groupId')
    expect(body).toHaveProperty('userId')
    expect(body).toHaveProperty('role')
    expect(body).toHaveProperty('points')

    expect(String(body.groupId)).toEqual(String(group._id))
    expect(String(body.userId)).toEqual(String(user._id))
    expect(body.role).toEqual('member')
    expect(body.points).toEqual(0)
  })
  it('should create group member, non-existing user', async () => {
    const userEmail = 'john.doe@example.com'

    req = httpMocks.createRequest({
      ...defaultReqOptions,
      method: 'POST',
      params: {
        groupId: String(group._id)
      },
      body: {
        email: userEmail
      }
    })

    const resData = await controller.createGroupMember(req, res)
    expect(resData.statusCode).toBe(201)
    const body = getMockResJson(resData)

    expect(body).toHaveProperty('groupId')
    expect(body).toHaveProperty('userId')
    expect(body).toHaveProperty('role')
    expect(body).toHaveProperty('points')

    expect(String(body.groupId)).toEqual(String(group._id))
    expect(body.userId).toBeDefined()
    expect(body.role).toEqual('member')
    expect(body.points).toEqual(0)

    const user = await User.findById(body.userId)
    expect(user).toBeDefined()
    expect(user?.email).toEqual(userEmail)
  })
  it('should get group', async () => {
    const req = httpMocks.createRequest({
      ...defaultReqOptions,
      method: 'GET',
      params: {
        groupId: String(group._id)
      }
    })

    const resData = await controller.getGroup(req, res)
    expect(resData.statusCode).toBe(200)
    const body = getMockResJson(resData)

    expect(body).toHaveProperty('_id')
    expect(body).toHaveProperty('name')

    expect(String(body._id)).toEqual(String(group._id))
    expect(body.name).toEqual(group.name)
  })
  it('should update group', async () => {
    const newName = 'New Group Name'

    req = httpMocks.createRequest({
      ...defaultReqOptions,
      method: 'PUT',
      params: {
        groupId: String(group._id)
      },
      body: {
        name: newName
      }
    })

    const resData = await controller.updateGroup(req, res)
    expect(resData.statusCode).toBe(200)
    const body = getMockResJson(resData)

    expect(body).toHaveProperty('_id')
    expect(body).toHaveProperty('name')

    expect(String(body._id)).toEqual(String(group._id))
    expect(body.name).toEqual(newName)
  })
  it('should delete group', async () => {
    const pre = await Group.find({})
    expect(pre).toHaveLength(1)

    req = httpMocks.createRequest({
      ...defaultReqOptions,
      method: 'DELETE',
      params: {
        groupId: String(group._id)
      }
    })

    const resData = await controller.deleteGroup(req, res)
    expect(resData.statusCode).toBe(204)

    const post = await Group.find({})
    expect(post).toHaveLength(0)
  })
  it('should get group members', async () => {
    const user = await createUser()
    await GroupService.registerGroupMember(group, user, { role: 'member' })

    req = httpMocks.createRequest({
      ...defaultReqOptions,
      method: 'GET',
      params: {
        groupId: String(group._id)
      }
    })

    const resData = await controller.getGroupMembers(req, res)
    expect(resData.statusCode).toBe(200)
    const body = getMockResJson(resData)

    expect(body).toHaveLength(2)
    expect(body[0]).toHaveProperty('_id')
    expect(body[0]).toHaveProperty('email')

    expect(String(body[0]._id)).toEqual(String(owner._id))
    expect(body[0].email).toEqual(owner.email)

    expect(String(body[1]._id)).toEqual(String(user._id))
    expect(body[1].email).toEqual(user.email)
  })

  it('should get group memberships', async () => {
    const user = await createUser()
    await GroupService.registerGroupMember(group, user, { role: 'member' })

    req = httpMocks.createRequest({
      ...defaultReqOptions,
      method: 'GET',
      params: {
        groupId: String(group._id)
      }
    })

    const resData = await controller.getGroupMemberships(req, res)
    expect(resData.statusCode).toBe(200)
    const body = getMockResJson(resData)

    expect(body).toHaveLength(2)
    expect(body[0]).toHaveProperty('userId')
    expect(body[0]).toHaveProperty('role')
    expect(body[0]).toHaveProperty('points')

    expect(String(body[0].userId)).toEqual(String(owner._id))
    expect(body[0].role).toEqual('owner')
    expect(body[0].points).toEqual(0)

    expect(String(body[1].userId)).toEqual(String(user._id))
    expect(body[1].role).toEqual('member')
    expect(body[1].points).toEqual(0)
  })
})
