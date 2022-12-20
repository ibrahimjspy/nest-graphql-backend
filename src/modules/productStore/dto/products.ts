import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class addToProductStoreDTO {
  @ApiProperty()
  @IsNotEmpty()
  shopId: string;

  @ApiProperty()
  @IsNotEmpty()
  productId: string;

  @ApiProperty()
  @IsNotEmpty()
  vendorId: string;
}

export class deleteFromProductStoreDTO {
  @ApiProperty()
  @IsNotEmpty()
  shopId: string;

  @ApiProperty()
  @IsNotEmpty()
  productIds: string[];
}
