import { ApiProperty } from '@nestjs/swagger';

export class UserIdDto {
  @ApiProperty()
  userId: string;
}

export class ShopIdDto {
  @ApiProperty()
  shopId: string;
}

export class OrderIdDto {
  @ApiProperty()
  orderId: string;
}
