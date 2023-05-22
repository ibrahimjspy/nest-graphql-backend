import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { ReportingPeriodEnum } from 'src/graphql/enums/orders';

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

export class StoreField {
  @ApiProperty()
  name: string;

  @ApiProperty()
  newValue: string;
}

export class OrderSummaryDto {
  @ApiProperty({
    required: false,
    default: 'TODAY',
    description: 'optional parameter to toggle between reporting period',
    enum: ReportingPeriodEnum,
  })
  @IsString()
  @IsOptional()
  reportingPeriod?: string;
}

export class shopInfoDto {
  @ApiProperty({ required: true, default: '' })
  name?: string;

  @ApiProperty({ required: true, default: '' })
  url?: string;

  @ApiProperty({ required: true, default: '' })
  about?: string;

  @ApiProperty({ required: true, default: '' })
  description?: string;

  @ApiProperty({ required: true, default: '' })
  facebook?: string;

  @ApiProperty({ required: true, default: '' })
  instagram?: string;

  @ApiProperty({ required: true, default: '' })
  twitter?: string;

  @ApiProperty({ required: true, default: '' })
  pinterest?: string;

  @ApiProperty({ required: true, default: '' })
  fields?: StoreField[];
}
