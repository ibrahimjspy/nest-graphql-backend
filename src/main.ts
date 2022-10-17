import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import packageInfo from '../package.json';

const corsOrigins = async () => process.env.CORS_ORIGINS.split(',');

const corsMethods = async () =>
  (process.env.CORS_METHODS || 'GET,PATCH,POST,PUT,DELETE,OPTIONS')
    .split(',')
    .map((method) => method.trim().toUpperCase());

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  // cores configuration
  app.enableCors({
    origin: await corsOrigins(),
    methods: await corsMethods(),
    // credentials: true,
  });

  // swagger configuration
  const config = new DocumentBuilder()
    .setTitle(packageInfo.name)
    .setDescription(packageInfo.description)
    .setVersion(packageInfo.version)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // app configuration
  await app.listen(process.env.PORT || 5000);
};
bootstrap();
