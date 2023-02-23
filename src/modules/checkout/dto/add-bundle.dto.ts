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

class CheckoutBundleDto {
  @ApiProperty()
  @IsNotEmpty()
  checkoutBundleId: string;

  @ApiProperty()
  @IsNotEmpty()
  quantity: number;
}

export class AddBundleDto {
  @ApiProperty()
  @IsNotEmpty()
  userEmail: string;

  @ApiProperty({ type: [BundleDto] })
  @Type(() => BundleDto)
  @ArrayNotEmpty()
  @ValidateNested()
  bundles: BundleDto[];
}

export class UpdateBundleStateDto {
  @ApiProperty({ isArray: true, type: String })
  @IsNotEmpty()
  checkoutBundleIds: Array<string>;

  @ApiProperty()
  @IsNotEmpty()
  userEmail: string;

  @ApiProperty()
  @IsNotEmpty()
  action: string;
}
export class UpdateBundlesDto {
  @ApiProperty()
  @IsNotEmpty()
  userEmail: string;

  @ApiProperty({ type: [CheckoutBundleDto] })
  @Type(() => CheckoutBundleDto)
  @ArrayNotEmpty()
  @ValidateNested()
  bundles: CheckoutBundleDto[];
}
