import { ArgumentsHost, Catch } from '@nestjs/common'
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets'

@Catch(WsException)
export class WSExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient()
    const data = host.switchToWs().getData()
    const error = exception.getError()
    const details = error instanceof Object ? { ...error } : { message: error }
    const jsonResponse = JSON.stringify({
      event: 'WebSocket Error',
      data: {
        role: client['role'] ?? 'no role',
        data: data,
        ...details,
      },
    })
    client.emit('exception', jsonResponse)
  }
}
