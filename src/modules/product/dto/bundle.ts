import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';

export class BundlesDto {
  @ApiProperty({ required: false })
  @IsOptional()
  productVariantId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  quantity: string;
}

export class BundleCreateDto {
  @ApiProperty({ required: true })
  @IsString()
  cartId: string;

  @ApiProperty({ required: true })
  @IsString()
  shopId: string;

  @ApiProperty({ required: true })
  @IsString()
  productId: string;

  @ApiProperty({ required: true })
  @IsString()
  description: string;

  @ApiProperty({ required: true })
  @IsString()
  name: string;

  @ApiProperty({
    required: true,
    type: BundlesDto,
    isArray: true,
  })
  @ValidateNested({ each: true })
  @Type(() => BundlesDto)
  productVariants: BundlesDto[];
}
