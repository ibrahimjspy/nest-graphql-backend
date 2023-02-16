import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PaginationDto } from 'src/graphql/dto/pagination.dto';
import { OrdersListDTO } from './list';
import { orderFulfillmentLineDTO } from './refund';
import { orderLineDTO } from './fulfill';
import { Transform, Type } from 'class-transformer';
import { b2cDto } from 'src/modules/shop/dto/shop';

export enum OrderReturnSortFieldEnum {
  CREATED_AT = 'CREATED_AT',
}

export enum OrderReturnDirectionEnum {
  DESC = 'DESC',
  ASC = 'ASC',
}
export class OrderReturnFilterDTO extends PaginationDto {
  @ApiProperty({ required: false, default: 'default-channel' })
  @IsOptional()
  channel?: string;

  @ApiProperty({
    enum: OrderReturnSortFieldEnum,
    required: false,
    default: OrderReturnSortFieldEnum.CREATED_AT,
  })
  @IsEnum(OrderReturnSortFieldEnum)
  @IsOptional()
  sort_field: OrderReturnSortFieldEnum;

  @ApiProperty({
    enum: OrderReturnDirectionEnum,
    required: false,
    default: OrderReturnDirectionEnum.DESC,
  })
  @IsEnum(OrderReturnDirectionEnum)
  @IsOptional()
  sort_order: OrderReturnDirectionEnum;
}

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
  @ArrayMinSize(1)
  orderLines: orderLineDTO[];
}
export class OrderReturnDTO {
  @ApiProperty({ required: true })
  @IsString()
  id: string;

  @ApiProperty({
    required: true,
    isArray: true,
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
