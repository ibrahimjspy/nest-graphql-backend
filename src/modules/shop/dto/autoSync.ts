import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class ImportBulkCategoriesDto {
  @ApiProperty({
    required: true,
    description: 'list of categories you want to sync ',
    isArray: true,
  })
  @IsArray()
  @ArrayMinSize(1)
  categoryIds: string[];

  @ApiProperty({ required: true, description: 'b2b shop id of retailer' })
  @IsString()
  shopId: string;

  @ApiProperty({
    required: true,
    description: 'b2c store id for which products should be added against',
  })
  @IsString()
  storeId: string;
}
