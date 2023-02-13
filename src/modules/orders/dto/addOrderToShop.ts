import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class OrderBundleDto {
  @ApiProperty({ required: true })
  @IsString()
  bundleId: string;

  @ApiProperty({ required: true })
  @IsNumber()
  quantity: number;

  @ApiProperty({ required: true, isArray: true, type: String })
  @IsArray()
  @ArrayMinSize(1)
  orderlineIds: string[];
}

export class ShopOrderDto {
  @ApiProperty({ required: true })
  @IsString()
  shippingMethodId: string;

  @ApiProperty({ required: true })
  @IsString()
  shopId: string;

  @ApiProperty({ required: true })
  @IsString()
  orderId: string;

  @ApiProperty({ required: false, isArray: true, type: String })
  @IsArray()
  @IsOptional()
  orderlineIds: string[];

  @ApiProperty({ required: false, isArray: true, type: OrderBundleDto })
  @ValidateNested({ each: true })
  @Type(() => OrderBundleDto)
  @IsArray()
  @IsOptional()
  marketplaceOrderBundles: OrderBundleDto[];
}

export class AddOrderToShopDto {
  @ApiProperty({
    required: true,
    isArray: true,
    type: ShopOrderDto,
    description: 'array of orders to add against a shop',
  })
  @ValidateNested({ each: true })
  @Type(() => ShopOrderDto)
  @IsArray()
  @ArrayMinSize(1)
  marketplaceOrders: ShopOrderDto[];
}
