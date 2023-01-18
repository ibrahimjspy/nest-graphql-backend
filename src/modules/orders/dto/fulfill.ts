import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNumber, IsString } from 'class-validator';

export class orderLineDTO {
  @ApiProperty({ required: true })
  @IsString()
  lineId: string;
  @ApiProperty({ required: true })
  @IsNumber()
  quantity: number;
}
export class OrderFulfillDto {
  @ApiProperty({ required: true })
  @IsString()
  orderId: string;

  @ApiProperty({ required: true, isArray: true, type: orderLineDTO })
  @IsArray()
  @ArrayMinSize(1)
  orderLines: orderLineDTO[];
}
