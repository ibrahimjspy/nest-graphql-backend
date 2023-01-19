import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';
import { orderLineDTO } from './fulfill';

export class orderFulfillmentLineDTO {
  @ApiProperty({ required: true })
  @IsString()
  fulfillmentLineId: string;
  @ApiProperty({ required: true })
  @IsNumber()
  quantity: number;
}

export class OrderRefundDTO {
  @ApiProperty({ required: true })
  @IsString()
  orderId: string;

  @ApiProperty({ required: true, isArray: true, type: orderLineDTO })
  @IsArray()
  orderLines: orderLineDTO[];

  @ApiProperty({ required: true, isArray: true, type: orderFulfillmentLineDTO })
  @IsArray()
  fulfillmentLines: orderFulfillmentLineDTO[];

  @ApiProperty({ required: true })
  @IsNumber()
  amountToRefund: number;
}
