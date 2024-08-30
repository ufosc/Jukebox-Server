import type { Request, Response } from 'express'
import httpMocks from 'node-mocks-http'

import { User } from 'server/models'
import { AuthService } from 'server/services'
import { getMockResJson } from 'server/utils/testing'

import * as controller from '../userController'

describe('User Controller', () => {
  let req: Request
  let res: Response
  const originalPassword: string = 'abc123'
  const createUser = async (): Promise<User> => {
    return await AuthService.registerUser({ email: 'JohnDoe', password: originalPassword })
  }

  beforeEach(() => {
    res = httpMocks.createResponse()
  })

  it('should register a user', async () => {
    const pre = await User.find({})
    expect(pre).toHaveLength(0)

    req = httpMocks.createRequest({
      method: 'POST',
      body: {
        email: 'test',
        password: 'test'
      }
    })

    const resData = await controller.register(req, res)
    expect(resData.statusCode).toBe(201)

    const body = getMockResJson(resData)
    expect(body).toHaveProperty('email')
    expect(body).toHaveProperty('password')
  })

  it('should login a user', async () => {
    const user = await createUser()

    req = httpMocks.createRequest({
      method: 'POST',
      body: {
        email: user.email,
        password: originalPassword
      }
    })

    const resData = await controller.login(req, res)
    expect(resData.statusCode).toBe(200)

    const body = getMockResJson(resData)
    expect(body).toHaveProperty('token') // TODO: Test if token works
  })

  it('should get a user', async () => {
    const user = await createUser()

    req = httpMocks.createRequest({
      method: 'GET',
      params: {
        id: user._id
      }
    })

    const resData = await controller.getUser(req, res)
    expect(resData.statusCode).toBe(200)

    const body = getMockResJson(resData)
    expect(body).toHaveProperty('_id')
    const obj = body

    expect(String(obj._id)).toEqual(String(user._id))
  })

  it('should partially update a user', async () => {
    const user = await createUser()
    await user.updateOne({ email: 'Pre-update' })
    const newemail = 'Post-update-change'

    req = httpMocks.createRequest({
      method: 'PATCH',
      params: {
        id: user._id
      },
      body: {
        email: newemail
      }
    })

    const resData = await controller.updateUser(req, res)
    expect(resData.statusCode).toBe(200)

    const body = getMockResJson(resData)
    expect(body).toHaveProperty('email')
    const obj = JSON.parse(JSON.stringify(body))

    expect(obj.email).toEqual(newemail)
    expect(obj.password).toEqual(user.password)
  })

  it('should update all fields on a user', async () => {
    const user = await createUser()
    await user.updateOne({ email: 'Pre-update', password: 'pre-update-pass' })
    const newemail = 'Post-update-change'
    const newPassword = 'Post-update-pass'

    req = httpMocks.createRequest({
      method: 'PATCH',
      params: {
        id: user._id
      },
      body: {
        email: newemail,
        password: newPassword
      }
    })

    const resData = await controller.updateUser(req, res)
    expect(resData.statusCode).toBe(200)

    const body = getMockResJson(resData)
    expect(body).toHaveProperty('email')
    expect(body).toHaveProperty('password')

    const obj = JSON.parse(JSON.stringify(body))
    expect(obj.email).toEqual(newemail)
    expect(obj.password).toEqual(newPassword)
  })

  it('should delete a user', async () => {
    const user = await createUser()

    req = httpMocks.createRequest({
      method: 'DELETE',
      params: {
        id: user._id
      }
    })

    const resData = await controller.deleteUser(req, res)
    expect(resData.statusCode).toBe(200)

    // Check if deleted user is returned
    const body = getMockResJson(resData)
    expect(body).toHaveProperty('_id')
    const obj = JSON.parse(JSON.stringify(body))

    expect(String(obj._id)).toEqual(String(user._id))

    // Check that user is deleted
    const usersInDb = await User.find({})
    expect(usersInDb).toHaveLength(0)
  })
})
