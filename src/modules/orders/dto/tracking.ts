import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class OrderTrackingDto {
  @ApiProperty({ required: true })
  @IsString()
  inquiryNumber: string;
}
