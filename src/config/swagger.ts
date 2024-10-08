import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

export const generateSwaggerDocument = (app: INestApplication) => {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Jukebox API')
    .setVersion('1.0.0')
    .addTag('jukeboxes')
    .addTag('spotify')
    .build()
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig)

  return swaggerDocument
}
