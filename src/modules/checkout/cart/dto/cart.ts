import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BundleCreateDto } from 'src/modules/product/dto/bundle';

export class DeleteBundlesDto {
  @ApiProperty()
  @IsString()
  userEmail: string;

  @ApiProperty({ required: true, isArray: true, type: String })
  @IsArray()
  @ArrayMinSize(1)
  checkoutBundleIds: string[];
}

export class ReplaceBundleDto {
  @ApiProperty()
  @IsString()
  userEmail: string;

  @ApiProperty()
  @IsString()
  checkoutBundleId: string;

  @ApiProperty()
  @IsString()
  newBundleId: string;
}

export class AddOpenPackDTO {
  @ApiProperty()
  @IsNotEmpty()
  userEmail: string;

  @ApiProperty({ required: true })
  @IsOptional()
  checkoutId: string;

  @ApiProperty({
    required: true,
    type: BundleCreateDto,
    isArray: true,
  })
  @ValidateNested({ each: true })
  @Type(() => BundleCreateDto)
  bundles: BundleCreateDto[];
}
