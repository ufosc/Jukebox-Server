import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { PORT } from './config'
import { HttpExceptionFilter } from './utils'

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, {
    logger: ['debug', 'error', 'fatal', 'log', 'verbose', 'warn'],
  })
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.setGlobalPrefix('api/v1')
  app.useGlobalFilters(new HttpExceptionFilter())

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Jukebox API')
    .setVersion('1.0.0')
    .addTag('jukeboxes')
    .addTag('spotify')
    .build()
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('/api/v1/docs/jukebox', app, swaggerDocument)

  await app.listen(PORT)
}
bootstrap()
