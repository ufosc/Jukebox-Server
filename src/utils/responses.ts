/**
 * @fileoverview General routes for the API.
 *
 * Additional resources:
 * - https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 * - https://enterprisecraftsmanship.com/posts/rest-api-response-codes-400-vs-500/
 */

import { type Response } from 'express'

interface ResponsePayload {
  status: number
  message: string
}

const formatResponse = (status: number, defaultMessage: string, message?: any): ResponsePayload => {
  // message = String(message) ?? ''
  message = String(message) ?? defaultMessage
  return {
    status,
    message
  }
}

export const responses = {
  /**
   * @response 200 - OK
   * The request succeeded.
   */
  ok: (res: Response, data?: any): any => {
    const payload: ResponsePayload = formatResponse(200, 'OK')

    return res.status(200).json(data ?? payload)
  },

  /**
   * @response 201 - Created
   * The request has been fulfilled, resulting in the creation of a new resource.
   */
  created: (res: Response, data?: any): any => {
    const payload: ResponsePayload = formatResponse(201, 'Created')

    return res.status(201).json(data ?? payload)
  },

  /**
   * @response 204 - No Content
   * The server successfully processed the request and is not returning any content.
   */
  noContent: (res: Response): any => {
    res.status(204).send()
  },

  /**
   * @response 400 - Bad Request
   * The server cannot or will not process the request due to an apparent client error.
   * Unlike 500 errors which the user can’t do anything about, 400 errors are their fault.
   */
  badRequest: (res: Response, message?: any): any => {
    const payload: ResponsePayload = formatResponse(400, 'Bad Request', message)

    res.status(400).json(payload)
  },

  /**
   * @response 401 - Unauthorized
   * The request has not been applied because it lacks valid authentication credentials for the target resource.
   */
  unauthorized: (res: Response, message?: any): any => {
    const payload: ResponsePayload = formatResponse(401, 'Unauthorized', message)

    res.status(401).json(payload)
  },

  /**
   * @response 403 - Forbidden
   * The server understood the request but refuses to authorize it.
   * Unlike 401 Unauthorized, the client's identity is known to the server, and is
   * usually caused by insufficient permissions.
   */
  forbidden: (res: Response, message?: any): any => {
    const payload: ResponsePayload = formatResponse(403, 'Forbidden', message)

    res.status(403).json(payload)
  },

  /**
   * @response 404 - Not Found
   * The requested resource could not be found but may be available in the future.
   * Subsequent requests by the client are permissible.
   */
  notFound: (res: Response, message?: any): any => {
    const payload: ResponsePayload = formatResponse(404, 'Not Found', message)

    res.status(404).json(payload)
  },

  /**
   * @response 405 - Method Not Allowed
   * The request method is known by the server but is not supported by the target resource.
   */
  methodNotAllowed: (res: Response, message?: any): any => {
    const payload: ResponsePayload = formatResponse(405, 'Method Not Allowed', message)

    res.status(405).json(payload)
  },

  /**
   * @response 409 - Conflict
   * This response is sent when a request conflicts with the current state of the server.
   */
  conflict: (res: Response, message?: any): any => {
    const payload: ResponsePayload = formatResponse(409, 'Conflict', message)

    res.status(409).json(payload)
  },

  /**
   * @response 410 - Gone
   * This response is sent when the requested content has been permanently deleted from server,
   * clients are expected to remove their caches and links to the resource. The HTTP specification
   * intends this status code to be used for "limited-time, promotional services".
   */
  gone: (res: Response, message?: any): any => {
    const payload: ResponsePayload = formatResponse(410, 'Gone', message)

    res.status(410).json(payload)
  },

  /**
   * @response 500 - Internal Server Error
   * The server has encountered a situation it does not know how to handle.
   * Never return 500 errors intentionally. The only way your service should
   * respond with a 500 code is by processing an unhandled exception.
   */
  internalServerError: (res: Response, message?: any): any => {
    const payload: ResponsePayload = formatResponse(500, 'Internal Server Error', message)

    res.status(500).json(payload)
  },

  /**
   * @response 501 - Not Implemented
   * The server either does not recognize the request method, or it lacks the ability to fulfil the request.
   * The only methods that servers are required to support (and therefore that must
   * not return this code) are GET and HEAD.
   */
  notImplemented: (res: Response, message?: any): any => {
    const payload: ResponsePayload = formatResponse(501, 'Not Implemented', message)

    res.status(501).json(payload)
  },

  /**
   * @response 502 - Bad Gateway
   * The server was acting as a gateway or proxy and received an invalid response from the upstream server.
   */
  badGateway: (res: Response, message?: any): any => {
    const payload: ResponsePayload = formatResponse(502, 'Bad Gateway', message)

    res.status(502).json(payload)
  },

  /**
   * @response 503 - Service Unavailable
   * The server cannot handle the request (because it is overloaded or down for maintenance).
   */
  serviceUnavailable: (res: Response, message?: any): any => {
    const payload: ResponsePayload = formatResponse(503, 'Service Unavailable', message)

    res.status(503).json(payload)
  },

  /**
   * @response 504 - Gateway Timeout
   * This error response is given when the server is acting as a gateway and cannot get a response in time.
   */
  gatewayTimeout: (res: Response, message?: any): any => {
    const payload: ResponsePayload = formatResponse(504, 'Gateway Timeout', message)

    res.status(504).json(payload)
  },

  /**
   * @response 511 - Network Authentication Required
   * The client needs to authenticate to gain network access.
   */
  networkAuthenticationRequired: (res: Response, message?: any): any => {
    const payload: ResponsePayload = formatResponse(511, 'Network Authentication Required', message)

    res.status(511).json(payload)
  }
}
