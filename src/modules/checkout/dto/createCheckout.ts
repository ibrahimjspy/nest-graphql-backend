import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCheckoutDto {
  @ApiProperty()
  @IsString()
  checkoutId: string;

  @ApiProperty()
  @IsString()
  userEmail: string;
}
