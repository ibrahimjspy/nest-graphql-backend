import { Module } from '@nestjs/common';
import { AppController, CatsController } from './controllers/app.controller';
import { TestController } from './controllers/productCard.controller';
import { AppService } from './services/app.service';

@Module({
  imports: [],
  controllers: [AppController, CatsController, TestController],
  providers: [AppService],
})
export class AppModule {}
