import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
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

export class pushToStoreDTO {
  @ApiProperty({ required: true, default: [] })
  productIds: string[];

  @ApiProperty({ description: 'b2b shop id of a retailer', required: true })
  @IsNotEmpty()
  shopId: string;

  @ApiProperty({ description: 'storefront id in b2c', required: true })
  @IsNotEmpty()
  storefrontId: string;
}
