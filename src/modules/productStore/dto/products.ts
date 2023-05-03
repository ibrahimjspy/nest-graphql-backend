import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

class productCreateDTO {
  @ApiProperty({ required: true })
  @IsString()
  id: string;

  @ApiProperty({ required: false })
  @IsOptional()
  description: string;

  @ApiProperty({ required: false })
  @IsOptional()
  category: string;

  @ApiProperty({ required: false })
  @IsOptional()
  name: string;

  @ApiProperty({ required: false, default: [] })
  @IsOptional()
  images: string[];
}

export class PushToStoreDto {
  @ApiProperty({ required: true, isArray: true, type: productCreateDTO })
  @IsArray()
  @ArrayMinSize(1)
  products: productCreateDTO[];

  @ApiProperty({ description: 'b2b shop id of a retailer', required: true })
  @IsNotEmpty()
  shopId: string;

  @ApiProperty({ description: 'storefront id in b2c', required: true })
  @IsNotEmpty()
  storefrontId: string;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  importList: boolean;
}
