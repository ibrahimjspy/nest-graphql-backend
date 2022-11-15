import { Module } from '@nestjs/common';
import { RetailerController } from './Retailer.controller';
import { RetailerService } from './Retailer.service';

@Module({
  controllers: [RetailerController],
  providers: [RetailerService],
  exports: [RetailerService],
})
export class RetailerModule {}
