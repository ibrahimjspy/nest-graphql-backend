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
}

export class UserAuth0IdDTO {
  @ApiProperty()
  @IsNotEmpty()
  userAuth0Id: string;
}

export class ChangeUserPasswordDTO {
  @ApiProperty()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  newPassword: string;
}

export class Auth0PaginationDTO {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  page: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  perPage: number;
}

export class AllUsersDTO extends Auth0PaginationDTO {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  auth0Connection: string;
}
