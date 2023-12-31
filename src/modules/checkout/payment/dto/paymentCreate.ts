import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PaymentCreateDto {
  @ApiProperty()
  @IsString()
  userEmail: string;

  @ApiProperty()
  @IsString()
  payment_methodID: string;

  @ApiProperty()
  @IsString()
  userName: string;
}

export class PaymentPreAuthDto {
  @ApiProperty()
  @IsString()
  checkoutID: string;

  @ApiProperty()
  @IsString()
  paymentMethodId: string;

  @ApiProperty()
  @IsString()
  userEmail: string;
}

export class PaymentMethodDeleteDto {
  @ApiProperty()
  @IsString()
  paymentMethodId: string;
  userEmail: string;
}

export class PaymentPreAuthV2Dto {
  @ApiProperty()
  @IsString()
  paymentMethodId: string;

  @ApiProperty()
  @IsString()
  userEmail: string;
}
