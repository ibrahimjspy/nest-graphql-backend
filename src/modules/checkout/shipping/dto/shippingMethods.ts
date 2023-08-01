import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { b2cDTO } from 'src/modules/product/dto/product.dto';

export class GetShippingMethodsDto extends b2cDTO {
  @ApiProperty()
  @IsString()
  checkoutId: string;
}
export class GetShippingMethodsV2Dto extends b2cDTO {
  @ApiProperty()
  @IsString()
  userEmail: string;
}

export class SelectShippingMethodDto {
  @ApiProperty()
  @IsString()
  checkoutId: string;

  @ApiProperty({ isArray: false, type: String })
  shippingMethodId: string;
}

export class ShippingMethodChannelListingUpdateDto {
  @ApiProperty({
    type: String,
    description: 'channel id of that shipping method',
  })
  @IsString()
  channelId: string;

  @ApiProperty({
    type: Number,
    description: 'updated price of shipping method',
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    type: Number,
    description: 'minimum order price',
    required: false,
  })
  @IsOptional()
  minimumOrderPrice: number;

  @ApiProperty({
    type: Number,
    description: 'maximum order price',
    required: false,
  })
  @IsOptional()
  maximumOrderPrice: number;
}

export class UpdateShippingMethodPriceDto {
  @ApiProperty({
    type: String,
    description: 'id of shipping method of which you need to update price for',
  })
  @IsString()
  shippingMethodId: string;

  @ApiProperty({
    type: ShippingMethodChannelListingUpdateDto,
    description:
      'pricing and channel information for that particular shipping method',
  })
  @ValidateNested()
  channelListingUpdate: ShippingMethodChannelListingUpdateDto;
}
