import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
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
  type: ProductFilterTypeEnum;
  category: string;

  @ApiProperty({ required: false })
  @IsOptional()
  retailerId: string;
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
