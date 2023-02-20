import { Module } from '@nestjs/common';
import { PaymentController } from './Payment.controller';
import { PaymentService } from './Payment.service';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
