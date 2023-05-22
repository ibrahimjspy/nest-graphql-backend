import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { orderLineDTO } from './fulfill';
import { Type } from 'class-transformer';

export class orderFulfillmentLineDTO {
  @ApiProperty({ required: true })
  @IsString()
  fulfillmentLineId: string;
  @ApiProperty({ required: true })
  @IsNumber()
  quantity: number;
}

export class OrderRefundProductsInput {
  @ApiProperty({ required: true, isArray: true, type: orderFulfillmentLineDTO })
  @IsArray()
  fulfillmentLines: orderFulfillmentLineDTO[];

  @ApiProperty({ required: true })
  @IsBoolean()
  includeShippingCosts: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  amountToRefund: boolean;

  @ApiProperty({ required: true, isArray: true, type: orderLineDTO })
  @IsArray()
  orderLines: orderLineDTO[];
}
export class OrderFulfillmentRefundDto {
  @ApiProperty({ required: true })
  @IsString()
  order: string;

  @ApiProperty({
    required: true,
    type: OrderRefundProductsInput,
  })
  @ValidateNested({ each: true })
  @Type(() => OrderRefundProductsInput)
  input: OrderRefundProductsInput;
}

export class OrderAmountRefundDto {
  @ApiProperty({ required: true })
  @IsString()
  orderId: string;
  @ApiProperty({ required: true })
  @IsNumber()
  amount: number;
}
