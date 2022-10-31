import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsNotEmpty, ValidateNested } from 'class-validator';

class BundleDto {
  @ApiProperty()
  @IsNotEmpty()
  bundleId: string;

  @ApiProperty()
  @IsNotEmpty()
  quantity: number;
}

export class AddBundleDto {
  @ApiProperty()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ type: [BundleDto] })
  @Type(() => BundleDto)
  @ArrayNotEmpty()
  @ValidateNested()
  bundles: BundleDto[];
}
