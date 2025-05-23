import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { PORT } from './config'
import { logger } from './middleware/logger.middleware'
import { HttpExceptionFilter } from './utils'

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, {
    logger: ['debug', 'error', 'fatal', 'log', 'verbose', 'warn'],
  })
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.setGlobalPrefix('api/v1', { exclude: [''] })
  app.useGlobalFilters(new HttpExceptionFilter())
  app.use(logger)

  app.enableCors({ origin: ['http://localhost:3000'], credentials: true })
  const config = new DocumentBuilder().addBearerAuth().build()

  const documentFactory = () => SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('api/v1/docs', app, documentFactory, {
    yamlDocumentUrl: '/api/v1/schema/jukebox/',
  })

  await app.listen(PORT)
}
bootstrap()
