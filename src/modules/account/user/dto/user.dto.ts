import { ApiProperty } from '@nestjs/swagger';

export class UserInputDTO {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;
}
