import { Module } from '@nestjs/common';
import { OrdersController } from './Orders.controller';
import { OrdersService } from './Orders.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
