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
import {
  ColorsFiltersEnum,
  PatternsFilterEnum,
  SleevesFilterEnum,
  StyleFiltersEnum,
} from './product.enums';

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
    description: 'whether a product is open pack',
  })
  isOpenPack?: boolean;

  @ApiProperty({
    required: false,
    description: 'date in iso format -- return product after this date',
  })
  @IsOptional()
  date?: string;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  startPrice?: number;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  endPrice?: number;

  @ApiProperty({
    required: false,
    isArray: true,
    enum: ColorsFiltersEnum,
    description: 'color of product, you can provide multiple colors',
  })
  @Type(() => String)
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]), {
    toClassOnly: true,
  })
  color?: ColorsFiltersEnum[];

  @ApiProperty({
    required: false,
    isArray: true,
    enum: StyleFiltersEnum,
    description: 'style of product, you can provide multiple styles',
  })
  @Type(() => String)
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]), {
    toClassOnly: true,
  })
  styles?: StyleFiltersEnum[];

  @ApiProperty({
    required: false,
    isArray: true,
    enum: PatternsFilterEnum,
    description: 'pattern of product, you can provide multiple patterns',
  })
  @Type(() => String)
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]), {
    toClassOnly: true,
  })
  patterns?: PatternsFilterEnum[];

  @ApiProperty({
    required: false,
    isArray: true,
    enum: SleevesFilterEnum,
    description: 'sleeves of product, you can provide multiple sleeves',
  })
  @Type(() => String)
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]), {
    toClassOnly: true,
  })
  sleeves?: SleevesFilterEnum[];

  @ApiProperty({
    required: false,
    description: 'whether a product is fulfilled by sharove or vendor himself',
  })
  isSharoveFulfillment?: boolean;
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

export class GetMoreLikeThisDto {
  @ApiProperty({
    required: false,
    description: 'product id in encoded format ',
  })
  @IsOptional()
  productId?: string;

  @ApiProperty({
    type: Number,
    required: true,
    default: 1,
    description: 'Number of document after which you need documents from',
  })
  page: number;

  @ApiProperty({ type: Number, required: true, default: 6 })
  totalCount: number;
}
