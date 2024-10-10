import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { SwaggerModule } from '@nestjs/swagger'
import { writeFileSync } from 'fs'
import { stringify } from 'yaml'
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

  const document = generateSwaggerDocument(app)
  // const yamlSpec = stringify(document)
  // writeFileSync('./generated/jukebox-api-spec.yml', yamlSpec, { flag: 'w+' })

  SwaggerModule.setup('/api/v1/docs/jukebox', app, document, {yamlDocumentUrl: '/api/v1/schema/jukebox'})

  await app.listen(PORT)
}
bootstrap()
