import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductCardModule } from './productCard/productCard.module';

@Module({
  imports: [ProductCardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
