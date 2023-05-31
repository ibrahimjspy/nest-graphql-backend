import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class createStoreDTO {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ required: false })
  @IsOptional()
  url?: string;

  @ApiProperty({ required: false, default: '' })
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false, default: '' })
  @IsOptional()
  about?: string;

  @ApiProperty({ required: false, default: '' })
  @IsOptional()
  madeIn?: string;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  minOrder?: number;

  @ApiProperty({ required: false, default: '' })
  @IsOptional()
  returnPolicy?: string;

  @ApiProperty({ required: false, default: '' })
  @IsOptional()
  storePolicy?: string;

  @ApiProperty({ required: false, default: '' })
  @IsOptional()
  logo?: string;

  @ApiProperty({ required: false, default: '' })
  @IsOptional()
  banner?: string;

  @ApiProperty({ required: false, default: '' })
  @IsOptional()
  facebook?: string;

  @ApiProperty({ required: false, default: '' })
  @IsOptional()
  pinterest?: string;

  @ApiProperty({ required: false, default: '' })
  @IsOptional()
  instagram?: string;

  @ApiProperty({ required: false, default: '' })
  @IsOptional()
  twitter?: string;
}

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

export class vendorIdsDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  vendorIds: number[];
}

export class shopIdByProductsDTO {
  @ApiProperty({ type: String, isArray: true, required: false })
  @IsOptional()
  productIds: string[];
}

export class allShopIdsDTO {
  @ApiProperty({ type: String, required: false, default: 1000 })
  @IsOptional()
  quantity: number;
}
export class b2cDto {
  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @Transform(({ obj, key }) => obj[key] === 'true')
  public isB2c?: boolean;
}

export class shopDetailDto extends b2cDto {
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  id?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  url?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  email?: string;
}

export class WorkflowNameDto {
  @ApiProperty({ type: String, required: true })
  workflowName: string;
}
