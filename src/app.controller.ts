import { Controller, Get } from '@nestjs/common'

@Controller()
export class AppController {
  @Get()
  healthCheck() {
    return {
      status: 200,
      message: 'Jukebox Server is online',
    }
  }
}
