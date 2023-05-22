import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class AddressDto {
  @ApiProperty({ required: false, default: '' })
  @IsOptional()
  country?: string;

  @ApiProperty({ required: false, default: '' })
  @IsOptional()
  countryArea?: string;

  @ApiProperty({ required: false, default: '' })
  @IsOptional()
  firstName?: string;

  @ApiProperty({ required: false, default: '' })
  @IsOptional()
  lastName?: string;

  @ApiProperty({ required: false, default: '' })
  @IsOptional()
  streetAddress1?: string;

  @ApiProperty({ required: false, default: '' })
  @IsOptional()
  streetAddress2?: string;

  @ApiProperty({ required: false, default: '' })
  @IsOptional()
  phone?: string;

  @ApiProperty({ required: false, default: '' })
  @IsOptional()
  companyName?: string;

  @ApiProperty({ required: false, default: '' })
  @IsOptional()
  postalCode?: string;

  @ApiProperty({ required: false, default: '' })
  @IsOptional()
  city?: string;
}

export class ShippingAddressCreateDto {
  @ApiProperty()
  @IsString()
  checkoutId: string;

  @ApiProperty()
  addressDetails: AddressDto;

  @ApiProperty({ required: false, default: '' })
  @IsOptional()
  shippingMethodId?: string;
}

export class BillingAddressDto {
  @ApiProperty()
  @IsString()
  checkoutId: string;

  @ApiProperty()
  addressDetails: AddressDto;
}

export class GetShippingMethodDto {
  @ApiProperty()
  @IsString()
  userId: string;
}
