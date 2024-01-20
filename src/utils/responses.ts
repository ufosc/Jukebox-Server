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
   * @returns Response 200 - OK
   * @description The request succeeded.
   */
  ok: (res: Response, data?: any) => {
    const payload: ResponsePayload = formatResponse(200, 'OK')

    return res.status(200).json(data ?? payload)
  },

  /**
   * @returns Response 201 - Created
   * @description The request has been fulfilled, resulting in the creation of a new resource.
   */
  created: (res: Response, data?: any) => {
    const payload: ResponsePayload = formatResponse(201, 'Created')

    return res.status(201).json(data ?? payload)
  },

  /**
   * @returns Response 204 - No Content
   * @description The server successfully processed the request and is not returning any content.
   */
  noContent: (res: Response) => {
    return res.status(204).send()
  },

  /**
   * @returns Response 301 - Moved Perminantly
   * @description The URL of the requested resource has been changed permanently.
   */
  movedPermanently: (res: Response, uri: string, headers?: { [field: string]: string }) => {
    return res.status(301).set(headers).redirect(uri)
  },

  /**
   * @returns Response 302 - Found
   * @description The URL of the requested resource has been changed temporarily. Further changes
   * in the URL might be made in the future. This is used as a temporary redirect.
   */
  found: (res: Response, uri: string, headers?: { [field: string]: string }) => {
    return res.status(302).set(headers).redirect(uri)
  },

  /**
   * @returns Response 303 - See Other
   * @description The response to the request can be found under another URL using a GET method.
   */
  seeOther: (res: Response, uri: string, headers?: { [field: string]: string }) => {
    return res.status(303).set(headers).redirect(uri)
  },

  /**
   * @returns Response 400 - Bad Request
   * @description The server cannot or will not process the request due to an apparent client error.
   * Unlike 500 errors which the user can’t do anything about, 400 errors are their fault.
   */
  badRequest: (res: Response, message?: any) => {
    const payload: ResponsePayload = formatResponse(400, 'Bad Request', message)

    return res.status(400).json(payload)
  },

  /**
   * @returns Response 401 - Unauthorized
   * @description The request has not been applied because it lacks valid authentication credentials for the target resource.
   */
  unauthorized: (res: Response, message?: any) => {
    const payload: ResponsePayload = formatResponse(401, 'Unauthorized', message)

    return res.status(401).json(payload)
  },

  /**
   * @returns Response 403 - Forbidden
   * @description The server understood the request but refuses to authorize it.
   * Unlike 401 Unauthorized, the client's identity is known to the server, and is
   * usually caused by insufficient permissions.
   */
  forbidden: (res: Response, message?: any) => {
    const payload: ResponsePayload = formatResponse(403, 'Forbidden', message)

    return res.status(403).json(payload)
  },

  /**
   * @returns Response 404 - Not Found
   * @description The requested resource could not be found but may be available in the future.
   * Subsequent requests by the client are permissible.
   */
  notFound: (res: Response, message?: any) => {
    const payload: ResponsePayload = formatResponse(404, 'Not Found', message)

    return res.status(404).json(payload)
  },

  /**
   * @returns Response 405 - Method Not Allowed
   * @description The request method is known by the server but is not supported by the target resource.
   */
  methodNotAllowed: (res: Response, message?: any) => {
    const payload: ResponsePayload = formatResponse(405, 'Method Not Allowed', message)

    return res.status(405).json(payload)
  },

  /**
   * @returns Response 409 - Conflict
   * @description This response is sent when a request conflicts with the current state of the server.
   */
  conflict: (res: Response, message?: any) => {
    const payload: ResponsePayload = formatResponse(409, 'Conflict', message)

    return res.status(409).json(payload)
  },

  /**
   * @returns Response 410 - Gone
   * @description This response is sent when the requested content has been permanently deleted from server,
   * clients are expected to remove their caches and links to the resource. The HTTP specification
   * intends this status code to be used for "limited-time, promotional services".
   */
  gone: (res: Response, message?: any) => {
    const payload: ResponsePayload = formatResponse(410, 'Gone', message)

    return res.status(410).json(payload)
  },

  /**
   * @returns Response 500 - Internal Server Error
   * @description The server has encountered a situation it does not know how to handle.
   * Never return 500 errors intentionally. The only way your service should
   * respond with a 500 code is by processing an unhandled exception.
   */
  internalServerError: (res: Response, message?: any) => {
    const payload: ResponsePayload = formatResponse(500, 'Internal Server Error', message)

    return res.status(500).json(payload)
  },

  /**
   * @returns Response 501 - Not Implemented
   * @description The server either does not recognize the request method, or it lacks the ability to fulfil the request.
   * The only methods that servers are required to support (and therefore that must
   * not return this code) are GET and HEAD.
   */
  notImplemented: (res: Response, message?: any) => {
    const payload: ResponsePayload = formatResponse(501, 'Not Implemented', message)

    return res.status(501).json(payload)
  },

  /**
   * @returns Response 502 - Bad Gateway
   * @description The server was acting as a gateway or proxy and received an invalid response from the upstream server.
   */
  badGateway: (res: Response, message?: any) => {
    const payload: ResponsePayload = formatResponse(502, 'Bad Gateway', message)

    return res.status(502).json(payload)
  },

  /**
   * @returns Response 503 - Service Unavailable
   * @description The server cannot handle the request (because it is overloaded or down for maintenance).
   */
  serviceUnavailable: (res: Response, message?: any) => {
    const payload: ResponsePayload = formatResponse(503, 'Service Unavailable', message)

    return res.status(503).json(payload)
  },

  /**
   * @returns Response 504 - Gateway Timeout
   * @description This error response is given when the server is acting as a gateway and cannot get a response in time.
   */
  gatewayTimeout: (res: Response, message?: any) => {
    const payload: ResponsePayload = formatResponse(504, 'Gateway Timeout', message)

    return res.status(504).json(payload)
  },

  /**
   * @returns Response 511 - Network Authentication Required
   * @description The client needs to authenticate to gain network access.
   */
  networkAuthenticationRequired: (res: Response, message?: any) => {
    const payload: ResponsePayload = formatResponse(511, 'Network Authentication Required', message)

    return res.status(511).json(payload)
  }
}
