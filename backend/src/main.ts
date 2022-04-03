import { NestFactory } from '@nestjs/core'
import { VersioningType } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { appConfig } from './app.config'
import { MzLogger } from './logger/logger.service'

async function bootstrap() {
  const logger = new MzLogger('Bootstrap')

  const app = await NestFactory.create(AppModule, { logger: appConfig.isVerbose() ? logger : false })
  app.setGlobalPrefix(appConfig.getGlobalPrefix()) // http://localhost:3000/api/...
  app.enableVersioning({ // http://localhost:3000/api/v1.0/...
    type: VersioningType.URI,
    defaultVersion: appConfig.getApiVersion()
  })

  logger.debug(`isProduction: ${appConfig.isProduction()} --- isDebug: ${appConfig.isDebug()} --- isVerbose: ${appConfig.isVerbose()}`)
  if (!appConfig.isProduction()) {
    const document = SwaggerModule.createDocument(app, new DocumentBuilder()
      .setTitle('WebappBackendStarter API')
      .setDescription('WebappBackendStarter API\'s documentation')
      .setVersion(appConfig.getApiVersion())
      .addBearerAuth()
      .addTag('authen')
      .addTag('users')
      .build())
    SwaggerModule.setup('api', app, document) // NOTE: access the Swagger documentation at "/api"
  }

  app.enableCors()
  logger.debug(`appConfig.getPort(): ${appConfig.getPort()}`)
  await app.listen(appConfig.getPort())
}
bootstrap()
