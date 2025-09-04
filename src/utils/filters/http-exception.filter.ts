import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common'
import { HttpArgumentsHost } from '@nestjs/common/interfaces'
import { error } from 'console'
import { Request, Response } from 'express'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    Logger.error(exception, exception.stack)
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    let status: number
    let name: string
    let message: string

    // For Nest exceptions that fail to getStatus(), mark them as internal server error to hide from user
    // A query failed error is caught by this, Nest marks that as 491
    try {
      status = exception.getStatus()
      name = exception.name
      message = exception.message
    } catch (error: unknown) {
      return response.status(500).json({
        type: 'server_error',
        errors: [
          {
            code: 'Internal Server Error',
            detail: 'a server function has failed, check logs or create an issue',
            attr: null,
          },
        ],
      })
    }

    if (status === 400) {
      return response.status(400).json(exception.getResponse())
    }

    if (status.toString()[0] === '4') {
      return response.status(status).json({
        type: 'client_error',
        errors: [
          {
            code: name,
            detail: message,
            attr: null,
          },
        ],
      })
    }

    return response.status(status).json({
      type: 'server_error',
      errors: [
        {
          code: name,
          detail: message,
          attr: null,
        },
      ],
    })
  }
}
