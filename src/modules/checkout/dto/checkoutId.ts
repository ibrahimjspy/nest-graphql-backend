import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CheckoutIdDto {
  @ApiProperty()
  @IsString()
  checkoutId: string;
}

export class OsPlaceOrderDto {
  @ApiProperty()
  @IsString()
  orderId: string;
}
