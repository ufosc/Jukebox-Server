/**
 * @fileoverview General routes for the API.
 *
 * Additional resources:
 * - https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 * - https://enterprisecraftsmanship.com/posts/rest-api-response-codes-400-vs-500/
 */

import { type NextFunction, type Response } from 'express'
import { ResponseCodes } from './codes'

export interface ResponsePayload {
  status: number
  type: string
  message?: string
}

const formatResponse = (status: number, message?: any): ResponsePayload => {
  // message = String(message) || ''
  const defaultMessage = ResponseCodes[status] || 'Unknown error'
  message = String(message) || null

  const payload: ResponsePayload = {
    status,
    type: defaultMessage
  }

  if (message && message !== 'undefined') {
    payload.message = message
  }

  return payload
}
export const formatJsonResponse = formatResponse

/**
 * Send an error from a view to the error handling middleware.
 * If unhandled in middleware, will cause a 500.
 */
export const errorResponse = (error: any, res: Response, next: NextFunction) => {
  res.status(500)
  return next(error)
}

/**
 * @response 200 - OK
 * The request succeeded.
 */
export const ok = (res: Response, data?: any, showStatus?: boolean): any => {
  const payload: ResponsePayload = formatResponse(200, data)

  if (showStatus) {
    return res.status(200).json(payload)
  } else {
    return res.status(200).json(data || payload)
  }
}

/**
 * @response 201 - Created
 * The request has been fulfilled, resulting in the creation of a new resource.
 */
export const created = (res: Response, data?: any, showStatus?: boolean): any => {
  const payload: ResponsePayload = formatResponse(201, data)

  if (showStatus) {
    return res.status(201).json(payload)
  } else {
    return res.status(201).json(data || payload)
  }
}

/**
 * @response 204 - No Content
 * The server successfully processed the request and is not returning any content.
 */
export const noContent = (res: Response): any => {
  res.status(204).send()
}

/**
 * @response 400 - Bad Request
 * The server cannot or will not process the request due to an apparent client error.
 * Unlike 500 errors which the user can’t do anything about, 400 errors are their fault.
 */
export const badRequest = (res: Response, message?: any, showStatus: boolean = true): any => {
  const payload: ResponsePayload = formatResponse(400, message)
  if (showStatus) {
    return res.status(400).json(payload)
  } else {
    return res.status(400).json(message || payload)
  }
}

/**
 * @response 401 - Unauthorized
 * The request has not been applied because it lacks valid authentication credentials for the target resource.
 */
export const unauthorized = (res: Response, message?: any, showStatus: boolean = true): any => {
  const payload: ResponsePayload = formatResponse(401, message)
  if (showStatus) {
    return res.status(401).json(payload)
  } else {
    return res.status(401).json(message || payload)
  }
}

/**
 * @response 403 - Forbidden
 * The server understood the request but refuses to authorize it.
 * Unlike 401 Unauthorized, the client's identity is known to the server.
 */
export const forbidden = (res: Response, message?: any, showStatus: boolean = true): any => {
  const payload: ResponsePayload = formatResponse(403, message)
  if (showStatus) {
    return res.status(403).json(payload)
  } else {
    return res.status(403).json(message || payload)
  }
}

/**
 * @response 404 - Not Found
 * The requested resource could not be found but may be available in the future.
 * Subsequent requests by the client are permissible.
 */
export const notFound = (res: Response, message?: any, showStatus: boolean = true): any => {
  const payload: ResponsePayload = formatResponse(404, message)
  if (showStatus) {
    return res.status(404).json(payload)
  } else {
    return res.status(404).json(message || payload)
  }
}

/**
 * @response 405 - Method Not Allowed
 * The request method is known by the server but is not supported by the target resource.
 */
export const methodNotAllowed = (res: Response, message?: any, showStatus: boolean = true): any => {
  const payload: ResponsePayload = formatResponse(405, message)
  if (showStatus) {
    return res.status(405).json(payload)
  } else {
    return res.status(405).json(message || payload)
  }
}

/**
 * @response 409 - Conflict
 * This response is sent when a request conflicts with the current state of the server.
 */
export const conflict = (res: Response, message?: any, showStatus: boolean = true): any => {
  const payload: ResponsePayload = formatResponse(409, message)
  if (showStatus) {
    return res.status(409).json(payload)
  } else {
    return res.status(409).json(message || payload)
  }
}

/**
 * @response 410 - Gone
 * This response is sent when the requested content has been permanently deleted from server,
 * clients are expected to remove their caches and links to the resource. The HTTP specification
 * intends this status code to be used for "limited-time, promotional services".
 */
export const gone = (res: Response, message?: any, showStatus: boolean = true): any => {
  const payload: ResponsePayload = formatResponse(410, message)
  if (showStatus) {
    return res.status(410).json(payload)
  } else {
    return res.status(410).json(message || payload)
  }
}

/**
 * @response 500 - Internal Server Error
 * The server has encountered a situation it does not know how to handle.
 * Never return 500 errors intentionally. The only way your service should
 * respond with a 500 code is by processing an unhandled exception.
 */
export const internalServerError = (
  res: Response,
  message?: any,
  showStatus: boolean = true
): any => {
  const payload: ResponsePayload = formatResponse(500, message)
  if (showStatus) {
    return res.status(500).json(payload)
  } else {
    return res.status(500).json(message || payload)
  }
}

/**
 * @response 501 - Not Implemented
 * The server either does not recognize the request method, or it lacks the ability to fulfil the request.
 * The only methods that servers are required to support (and therefore that must
 * not return this code) are GET and HEAD.
 */
export const notImplemented = (res: Response, message?: any, showStatus: boolean = true): any => {
  const payload: ResponsePayload = formatResponse(501, message)
  if (showStatus) {
    return res.status(501).json(payload)
  } else {
    return res.status(501).json(message || payload)
  }
}

/**
 * @response 502 - Bad Gateway
 * The server was acting as a gateway or proxy and received an invalid response from the upstream server.
 */
export const badGateway = (res: Response, message?: any, showStatus: boolean = true): any => {
  const payload: ResponsePayload = formatResponse(502, message)
  if (showStatus) {
    return res.status(502).json(payload)
  } else {
    return res.status(502).json(message || payload)
  }
}

/**
 * @response 503 - Service Unavailable
 * The server cannot handle the request (because it is overloaded or down for maintenance).
 */
export const serviceUnavailable = (
  res: Response,
  message?: any,
  showStatus: boolean = true
): any => {
  const payload: ResponsePayload = formatResponse(503, message)
  if (showStatus) {
    return res.status(503).json(payload)
  } else {
    return res.status(503).json(message || payload)
  }
}

/**
 * @response 504 - Gateway Timeout
 * This error response is given when the server is acting as a gateway and cannot get a response in time.
 */
export const gatewayTimeout = (res: Response, message?: any, showStatus: boolean = true): any => {
  const payload: ResponsePayload = formatResponse(504, message)
  if (showStatus) {
    return res.status(504).json(payload)
  } else {
    return res.status(504).json(message || payload)
  }
}

/**
 * @response 511 - Network Authentication Required
 * The client needs to authenticate to gain network access.
 */
export const networkAuthenticationRequired = (
  res: Response,
  message?: any,
  showStatus: boolean = true
): any => {
  const payload: ResponsePayload = formatResponse(511, message)
  if (showStatus) {
    return res.status(511).json(payload)
  } else {
    return res.status(511).json(message || payload)
  }
}
