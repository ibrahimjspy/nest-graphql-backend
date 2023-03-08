import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { b2cDTO } from 'src/modules/product/dto/product.dto';

export class GetShippingMethodsDto extends b2cDTO {
  @ApiProperty()
  @IsString()
  checkoutId: string;
}

export class SelectShippingMethodDto {
  @ApiProperty()
  @IsString()
  checkoutId: string;

  @ApiProperty({ isArray: false, type: String })
  shippingMethodId: string;
}
