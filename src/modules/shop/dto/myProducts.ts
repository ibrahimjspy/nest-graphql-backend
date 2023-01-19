import { ApiProperty } from '@nestjs/swagger';

export class removeProductDTO {
  @ApiProperty({ required: true })
  productIds: string[];
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
}
