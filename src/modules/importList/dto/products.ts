import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class importProductsDTO {
  @ApiProperty()
  @IsNotEmpty()
  shopId: string;

  @ApiProperty()
  @IsNotEmpty()
  productId: string;

  @ApiProperty()
  @IsNotEmpty()
  productVariantIds: string[];
}
