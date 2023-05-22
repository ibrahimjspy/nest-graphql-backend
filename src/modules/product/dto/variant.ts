import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ProductVariantStockUpdateDTO {
  @ApiProperty({ required: true })
  @IsString()
  productVariantId: string;
  @ApiProperty({ required: true })
  @IsNumber()
  quantity: number;
}
