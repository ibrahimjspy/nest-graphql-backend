import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class shopIdByVariantsDTO {
  @ApiProperty({ type: String, isArray: true, required: false })
  @IsOptional()
  productVariantIds: string[];

  @ApiProperty({ type: String, isArray: true, required: false })
  @IsOptional()
  orderIds: string[];
}

export class shopIdDTO {
  @ApiProperty({ type: String, required: true })
  shopId: string;
}

export class accountIdDTO {
  @ApiProperty({ type: String, required: true })
  accountId: string;
}

export class removeProductDTO {
  @ApiProperty({ required: true })
  productIds: string[];
}
