import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationDto } from 'src/graphql/dto/pagination.dto';

export class addToProductStoreDTO {
  @ApiProperty()
  @IsNotEmpty()
  shopId: string;

  @ApiProperty()
  @IsNotEmpty()
  productId: string;

  @ApiProperty()
  @IsNotEmpty()
  vendorId: string;
}

export class deleteFromProductStoreDTO {
  @ApiProperty()
  @IsNotEmpty()
  shopId: string;

  @ApiProperty()
  @IsNotEmpty()
  productIds: string[];
}

export class getStoredProductsDTO extends PaginationDto {
  @ApiProperty({ required: false, default: [] })
  @IsOptional()
  productIds: string[];
}

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
  media: string[];
}

export class pushToStoreDTO {
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
}
