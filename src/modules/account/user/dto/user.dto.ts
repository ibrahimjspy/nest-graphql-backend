import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UserInputDTO {
  @ApiProperty({ required: false })
  @IsOptional()
  firstName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  lastName: string;
}

export class Auth0UserInputDTO extends UserInputDTO {
  @ApiProperty()
  @IsNotEmpty()
  userAuth0Id: string;

  @ApiProperty({ required: false })
  @IsOptional()
  jobTitleId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  sellersPermitId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  phoneNumber: string;

  @ApiProperty({ required: false })
  @IsOptional()
  resaleCertificate: string;

  @ApiProperty({ required: false })
  @IsOptional()
  sellerPermitImage: string;

  @ApiProperty({ required: false })
  @IsOptional()
  address: string;

  @ApiProperty({ required: false })
  @IsOptional()
  stripeCustomerId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  website: string;
}

export class UserAuth0IdDTO {
  @ApiProperty()
  @IsNotEmpty()
  userAuth0Id: string;
}

export class ChangeUserPasswordDTO extends UserAuth0IdDTO {
  @ApiProperty()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  newPassword: string;
}

export class UserAddressDTO {
  @ApiProperty({ required: false })
  @IsOptional()
  address1: string;

  @ApiProperty({ required: false })
  @IsOptional()
  address2: string;

  @ApiProperty({ required: false })
  @IsOptional()
  zipcode: string;

  @ApiProperty({ required: false })
  @IsOptional()
  city: string;

  @ApiProperty({ required: false })
  @IsOptional()
  country: string;

  @ApiProperty({ required: false })
  @IsOptional()
  state: string;

  @ApiProperty({ required: false })
  @IsOptional()
  companyName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  mobileNumber: string;

  @ApiProperty({ required: false })
  @IsOptional()
  faxNumber: string;
}
