import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.PORT || 5000);
}

bootstrap();

// specific cors setting
// app.enableCors({
//   origin: process.env.CORS_ORIGINS.split(','),
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
//   credentials: true,
// });
