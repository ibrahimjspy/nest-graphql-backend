import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationDto } from 'src/graphql/dto/pagination.dto';

export enum ProductFilterTypeEnum {
  POPULAR_ITEMS = 'popular',
  NEW_ARRIVALS = 'new',
}

export class RetailerIdDto {
  @ApiProperty({ required: false })
  @IsOptional()
  retailerId: string;
}

export class ProductFilterDto extends PaginationDto {
  @ApiProperty({
    enum: ProductFilterTypeEnum,
    required: false,
    default: ProductFilterTypeEnum.NEW_ARRIVALS,
  })
  @IsEnum(ProductFilterTypeEnum)
  @IsOptional()
  type?: ProductFilterTypeEnum;

  @ApiProperty({ required: false })
  @IsOptional()
  retailerId?: string;

  @ApiProperty({ required: false, type: Array })
  @IsOptional()
  productIds?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  storeId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  vendorId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  category?: string;

  @ApiProperty({
    required: false,
    description:
      'date in iso format -- how many days before you want products from',
  })
  @IsOptional()
  daysBefore?: string;
}

export class ProductListDto {
  @ApiProperty()
  categoryId: string;
}

export class ProductListFilterDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  retailerId: string;
}

export class shopIdDTO {
  @ApiProperty({ type: String, required: true })
  shopId: string;
}

export class b2cDTO {
  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @Transform(({ obj, key }) => obj[key] === 'true')
  public isB2c?: boolean;
}

export class shopProductsDTO extends IntersectionType(b2cDTO, PaginationDto) {
  @ApiProperty()
  categoryId: string;
}

export class GetBundlesDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description: 'product id in uuid format ',
  })
  @IsOptional()
  productId?: string;

  @ApiProperty({
    required: false,
    description: 'variant ids in uuid format you need data for',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  @Transform(({ value }) => value.split(','))
  productVariants?: string[];

  @ApiProperty({
    required: false,
    description: 'bundle ids in uuid format you need data for',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  @Transform(({ value }) => value.split(','))
  bundleIds?: string[];

  @ApiProperty({
    required: false,
    default: false,
    description:
      'if you want product details fetched from saleor against bundle you can pass this filter as true  warn -- it might increase response time',
  })
  @IsBoolean()
  @Transform(({ obj, key }) => obj[key] === 'true')
  getProductDetails?: boolean;
}

export class ProductIdDto {
  @ApiProperty({ type: String, required: true })
  productId: string;
}

export class ProductDetailsDto extends b2cDTO {
  @ApiProperty({
    required: false,
    description: 'product id in uuid format ',
  })
  @IsOptional()
  productId?: string;

  @ApiProperty({
    required: false,
    description: 'product slug in uuid format ',
  })
  @IsOptional()
  productSlug?: string;
}
