import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/graphql/dto/pagination.dto';

export enum ProductFilterTypeEnum {
  POPULAR_ITEMS = 'popular',
  NEW_ARRIVALS = 'new',
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
}
