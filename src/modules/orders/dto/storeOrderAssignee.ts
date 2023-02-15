import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class StoreOrderAssigneeDto {
  @ApiProperty({ required: true })
  @IsString()
  staffId: string;

  @ApiProperty({ required: true })
  @IsString()
  staffName: string;

  @ApiProperty({ required: true })
  @IsString()
  orderId: string;
}
