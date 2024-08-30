/**
 * @fileoverview Test for general api routes.
 */
import type { Request, Response } from 'express'
import httpMocks from 'node-mocks-http'
import * as controller from '../baseController'

describe('Base controller', () => {
  let req: Request
  let res: Response

  beforeEach(() => {
    res = httpMocks.createResponse()
  })

  it('should return ok', async () => {
    req = httpMocks.createRequest({
      method: 'GET'
    })

    await controller.healthCheck(req, res)
    expect(res.statusCode).toBe(200)
  })
})
