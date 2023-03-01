import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { PaginationDto } from 'src/graphql/dto/pagination.dto';

export class removeMyProductsDTO {
  @ApiProperty({ required: true })
  productIds: string[];

  @ApiProperty({ required: true })
  storeId: string;
}

class editProductDTO {
  @ApiProperty({ required: false })
  name: string;

  @ApiProperty({
    required: false,
    description: 'make sure you are adding description in JSONString format',
  })
  description: string;

  @ApiProperty({ required: false })
  category: string;
}

export class updateMyProductDTO {
  @ApiProperty({ required: true })
  productId: string;

  @ApiProperty({ required: true, type: editProductDTO })
  input: editProductDTO;

  @ApiProperty({ type: String, isArray: true, required: true, default: [] })
  @IsArray()
  removeMediaIds: string[];
}

export class myProductsDTO extends PaginationDto {
  @ApiProperty({ required: false, default: '' })
  search: string;
}
