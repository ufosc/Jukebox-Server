import { ArgumentsHost, Catch, InternalServerErrorException } from '@nestjs/common'
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets'

@Catch()
export class WSExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    console.log(exception)
    const client = host.switchToWs().getClient()
    const data = host.switchToWs().getData()
    const error = exception.message
    const jsonResponse = JSON.stringify({
      event: 'WebSocket Error',
      data: {
        role: client['role'] ?? 'no role',
        data: data,
        error,
      },
    })
    client.emit('exception', jsonResponse)
  }
}
