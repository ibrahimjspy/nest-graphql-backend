import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UserInputDTO {
  @ApiProperty({ required: false })
  @IsOptional()
  firstName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  lastName: string;
}

export class UserAuth0DTO {
  @ApiProperty()
  @IsNotEmpty()
  userAuth0Id: string;
}

export class Auth0UserInputDTO extends IntersectionType(
  UserAuth0DTO,
  UserInputDTO,
) {}
