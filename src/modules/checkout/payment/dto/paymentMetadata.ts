import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class PaymentMetadataDto {
  @ApiProperty()
  @IsString()
  userEmail: string;

  @ApiProperty()
  @IsOptional()
  paymentIntentId: string;

  @ApiProperty()
  @IsString()
  paymentMethodId: string;
}
