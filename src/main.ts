import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './core/exceptions/filters';
import packageInfo from '../package.json';
// import tracer from './tracer';

// const corsOrigins = async () => process.env.CORS_ORIGINS.split(',');

// const corsMethods = async () =>
//   (process.env.CORS_METHODS || 'GET,PATCH,POST,PUT,DELETE,OPTIONS')
//     .split(',')
//     .map((method) => method.trim().toUpperCase());

const bootstrap = async () => {
  // TODO connect tracing to deployed signoz
  // await tracer.start();
  const app = await NestFactory.create(AppModule);

  // cores configuration
  app
    .enableCors
    //   {
    //   origin: await corsOrigins(),
    //   methods: await corsMethods(),
    //   credentials: true,
    // }
    ();

  // swagger configuration
  const config = new DocumentBuilder()
    .setTitle(packageInfo.name)
    .setDescription(packageInfo.description)
    .setVersion(packageInfo.version)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // add exception filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // enable auto validation
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // app configuration
  await app.listen(process.env.PORT || 5000);
};
bootstrap();
