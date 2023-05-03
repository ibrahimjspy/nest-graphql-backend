import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { OrdersListDTO } from './list';
import { orderFulfillmentLineDTO } from './refund';
import { orderLineDTO } from './fulfill';
import { Transform, Type } from 'class-transformer';
import { b2cDto } from 'src/modules/shop/dto/shop';

export class OrderReturnProductsInput {
  @ApiProperty({ required: true, isArray: true, type: orderFulfillmentLineDTO })
  @IsArray()
  fulfillmentLines: orderFulfillmentLineDTO[];

  @ApiProperty({ required: true })
  @IsBoolean()
  includeShippingCosts: boolean;

  @ApiProperty({ required: true })
  @IsBoolean()
  refund: boolean;

  @ApiProperty({ required: true, isArray: true, type: orderLineDTO })
  @IsArray()
  orderLines: orderLineDTO[];
}
export class OrderReturnDTO {
  @ApiProperty({ required: true })
  @IsString()
  id: string;

  @ApiProperty({
    required: true,
    type: OrderReturnProductsInput,
  })
  @ValidateNested({ each: true })
  @Type(() => OrderReturnProductsInput)
  input: OrderReturnProductsInput;
}

export class ReturnsStaffDto extends b2cDto {
  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @Transform(({ obj, key }) => obj[key] === 'true')
  public staff: boolean;
}

export class ReturnOrderListDto extends OrdersListDTO {
  @ApiProperty({ required: false, default: 'false' })
  @IsOptional()
  isStaffReturn: string;
}
