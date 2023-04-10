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
}
