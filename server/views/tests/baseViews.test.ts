/**
 * @fileoverview Test for general api routes.
 */
import type { NextFunction, Request, Response } from 'express'
import httpMocks from 'node-mocks-http'
import * as views from '../baseViews'

describe('Base controller', () => {
  let req: Request
  let res: Response
  let next: NextFunction

  beforeEach(() => {
    res = httpMocks.createResponse()
    next = jest.fn()
  })

  it('should return ok', async () => {
    req = httpMocks.createRequest({
      method: 'GET'
    })

    await views.healthcheck(req, res, next)
    expect(res.statusCode).toBe(200)
  })
})
