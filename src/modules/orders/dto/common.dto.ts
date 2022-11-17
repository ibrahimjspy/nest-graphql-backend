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
