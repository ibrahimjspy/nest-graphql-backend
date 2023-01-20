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
