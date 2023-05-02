import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/graphql/dto/pagination.dto';

export class shopIdDTO {
  @ApiProperty({ type: String, required: true })
  shopId: string;
}

export class b2cDTO {
  @ApiProperty({ required: false, default: false })
  @IsBoolean()
  @Transform(({ obj, key }) => obj[key] === 'true')
  public isB2c: boolean;
}

export class SyncCategoriesDto extends PaginationDto {
  @ApiProperty({
    type: String,
    required: false,
    default: 0,
    description: 'Filter categories by the nesting level in the category tree.',
  })
  categoryLevel: number;
}

export class CategoriesDto extends PaginationDto {
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  shopId: string;
}
