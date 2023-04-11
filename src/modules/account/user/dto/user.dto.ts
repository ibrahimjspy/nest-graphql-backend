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

}
