import httpMocks from 'node-mocks-http'
import * as controller from '../userController'
import { Request, Response } from 'express'
import { User } from 'src/models'
import { getMockResJson } from 'src/utils/testing'


describe('User Controller', () => {
  let req: Request
  let res: Response
  
  beforeEach(() => {
    res = httpMocks.createResponse()
  })
  
  it('should register a user', async () => {
    const pre = await User.find({})
    expect(pre).toHaveLength(0)
    
    req = httpMocks.createRequest({
      method: 'POST',
      body: {
        username: 'test',
        password: 'test'
      }
    })
    
    const resData = await controller.register(req, res)
    expect(resData.statusCode).toBe(201)
    
    const body = getMockResJson(resData)
    expect(body).toHaveProperty('username')
    expect(body).toHaveProperty('password')
  })
  
  it('should login a user', async () => {
    expect(true).toBeFalsy()
  })
  
  it('should get a user', async () => {
    expect(true).toBeFalsy()
  })
  
  it('should update a user', async () => {
    expect(true).toBeFalsy()
  })
  
  it('should delete a user', async () => {
    expect(true).toBeFalsy()
  })
})
