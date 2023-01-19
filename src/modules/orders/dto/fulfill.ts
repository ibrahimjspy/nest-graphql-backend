import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class orderLineDTO {
  @ApiProperty({ required: true })
  @IsString()
  orderLineId: string;
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

export class orderFulfillmentCancelDTO {
  @ApiProperty({ required: true })
  @IsString()
  fulfillmentId: string;
  @ApiProperty({ required: false, default: '' })
  @IsOptional()
  warehouseId: string;
}
