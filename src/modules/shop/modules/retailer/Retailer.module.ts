import { Module } from '@nestjs/common';
import { RetailerController } from './Retailer.controller';
import { RetailerService } from './Retailer.service';
import { PaymentsModule } from './payments/Payments.module';
@Module({
  imports: [PaymentsModule],
  controllers: [RetailerController],
  providers: [RetailerService],
  exports: [RetailerService],
})
export class RetailerModule {}
