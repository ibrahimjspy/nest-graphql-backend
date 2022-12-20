import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class shopIdByVariantsDTO {
  @ApiProperty()
  @IsNotEmpty()
  productVariantIds: string[];
}
