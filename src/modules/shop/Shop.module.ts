import { Module } from '@nestjs/common';
import { ShopController } from './Shop.controller';
import { ShopService } from './Shop.service';

@Module({
  controllers: [ShopController],
  providers: [ShopService],
  exports: [ShopService],
})
export class ShopModule {}
