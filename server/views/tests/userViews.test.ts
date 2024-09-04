import type { NextFunction, Request, Response } from 'express'
import httpMocks from 'node-mocks-http'

import { User } from 'server/models'
import { AuthService } from 'server/services'
import { getMockResJson } from 'server/utils'

import * as views from '../userViews'

describe('User Controller', () => {
  let req: Request
  let res: Response
  let next: NextFunction
  const originalPassword: string = 'abc123'
  const createUser = async (): Promise<User> => {
    return await AuthService.registerUser({ email: 'JohnDoe', password: originalPassword })
  }

  beforeEach(() => {
    res = httpMocks.createResponse()
    next = jest.fn()
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

    const resData = await views.registerUserView(req, res, next)
    expect(resData.statusCode).toBe(201)

    const body = getMockResJson(resData)
    expect(body).toHaveProperty('email')
    expect(body).not.toHaveProperty('password')
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

    const resData = await views.loginUserView(req, res, next)
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

    const resData = await views.UserViewset.get(req, res, next)
    expect(resData.statusCode).toBe(200)

    const body = getMockResJson(resData)
    expect(body).toHaveProperty('id')
    const obj = body

    expect(String(obj.id)).toEqual(String(user._id))
  })

  it('should partially update a user', async () => {
    const user = await createUser()
    await user.updateOne({ email: 'user@example.com' })
    const newemail = 'user-changed@example.com'

    req = httpMocks.createRequest({
      method: 'PATCH',
      params: {
        id: user._id.toString()
      },
      body: {
        email: newemail
      }
    })

    const resData = await views.UserViewset.partialUpdate(req, res, next)
    expect(resData.statusCode).toBe(200)

    const body = getMockResJson(resData)
    expect(body).toHaveProperty('email')
    expect(body).not.toHaveProperty('password')
    const obj = JSON.parse(JSON.stringify(body))

    expect(obj.email).toEqual(newemail)
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

    const resData = await views.UserViewset.update(req, res, next)
    expect(resData.statusCode).toBe(200)

    const body = getMockResJson(resData)
    expect(body).toHaveProperty('email')
    expect(body).not.toHaveProperty('password')

    const obj = JSON.parse(JSON.stringify(body))
    expect(obj.email).toEqual(newemail)
  })

  it('should delete a user', async () => {
    const user = await createUser()

    req = httpMocks.createRequest({
      method: 'DELETE',
      params: {
        id: user._id
      }
    })

    const resData = await views.UserViewset.delete(req, res, next)
    expect(resData.statusCode).toBe(200)

    // Check if deleted user is returned
    const body = getMockResJson(resData)
    expect(body).toHaveProperty('id')
    const obj = JSON.parse(JSON.stringify(body))

    expect(String(obj.id)).toEqual(String(user._id))

    // Check that user is deleted
    const usersInDb = await User.find({})
    expect(usersInDb).toHaveLength(0)
  })
})
