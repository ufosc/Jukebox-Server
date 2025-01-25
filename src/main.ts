import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { generateSwaggerDocument, PORT } from './config'
import { HttpExceptionFilter } from './utils'

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, {
    logger: ['debug', 'error', 'fatal', 'log', 'verbose', 'warn'],
  })
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.setGlobalPrefix('api/v1')
  app.useGlobalFilters(new HttpExceptionFilter())

  app.enableCors({ origin: ['http://localhost:3000'], credentials: true })
  const document = generateSwaggerDocument(app)
  Logger.error("Starting app 1...")
  

  SwaggerModule.setup('/api/docs/', app, document, { yamlDocumentUrl: '/api/v1/schema/jukebox/' })

  await app.listen(PORT)
}
bootstrap()
