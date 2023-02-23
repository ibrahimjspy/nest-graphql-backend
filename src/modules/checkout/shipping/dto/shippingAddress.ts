import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { AddressDetailType } from 'src/graphql/handlers/checkout.type';

export class ShippingAddressCreateDto {
  @ApiProperty()
  @IsString()
  checkoutId: string;

  @ApiProperty()
  addressDetails: AddressDetailType;

  @ApiProperty()
  @IsString()
  shippingMethodId: string;
}

export class BillingAddressDto {
  @ApiProperty()
  @IsString()
  checkoutId: string;

  @ApiProperty()
  addressDetails: AddressDetailType;
}

export class SelectShippingAddressDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty({ isArray: true, type: String })
  shippingIds: string[];
}

export class GetShippingMethodDto {
  @ApiProperty()
  @IsString()
  userId: string;
}
