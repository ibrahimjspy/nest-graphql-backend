import { ApiProperty } from '@nestjs/swagger';
import { CountryCode } from 'src/graphql/enums';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class AddressDto {
  @ApiProperty()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty()
  @IsNotEmpty()
  streetAddress1: string;

  @ApiProperty()
  streetAddress2: string;

  @ApiProperty()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  cityArea: string;

  @ApiProperty()
  @IsNotEmpty()
  postalCode: string;

  @ApiProperty({ enum: CountryCode, default: CountryCode.US })
  @IsEnum(CountryCode)
  @IsNotEmpty()
  country: CountryCode;

  @ApiProperty()
  countryArea: string;

  @ApiProperty()
  @IsNotEmpty()
  phone: string;
}
