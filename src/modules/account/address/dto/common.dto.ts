import { ApiProperty } from '@nestjs/swagger';

export class UserIdDto {
  @ApiProperty()
  userId: string;
}

export class AddressIdDto {
  @ApiProperty()
  addressId: string;
}
