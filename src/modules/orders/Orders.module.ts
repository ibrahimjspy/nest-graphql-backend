import { Module } from '@nestjs/common';
import { OrdersController } from './Orders.controller';
import { OrdersService } from './Orders.service';
import UpsService from 'src/external/services/Ups.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, UpsService],
  exports: [OrdersService],
})
export class OrdersModule {}
