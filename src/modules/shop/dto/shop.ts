import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class shopIdByVariantsDTO {
  @ApiProperty({ type: String, isArray: true })
  @IsNotEmpty()
  productVariantIds: string[];
}
