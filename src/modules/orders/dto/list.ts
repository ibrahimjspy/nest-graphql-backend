import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsEmail, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/graphql/dto/pagination.dto';
import { b2cDto } from 'src/modules/shop/dto/shop';

const DEFAULT_START_DATE = '1970-12-26';
export enum OrderStatusEnum {
  'READY_TO_FULFILL',
  'READY_TO_CAPTURE',
  'UNFULFILLED',
  'UNCONFIRMED',
  'PARTIALLY_FULFILLED',
  'FULFILLED',
  'CANCELED',
}
enum PaymentChargeStatusEnum {
  'NOT_CHARGED',
  'PENDING',
  'PARTIALLY_CHARGED',
  'FULLY_CHARGED',
  'PARTIALLY_REFUNDED',
  'FULLY_REFUNDED',
  'REFUSED',
  'CANCELLED',
}

enum ReturnStatusEnum {
  'RETURNED',
  'PARTIALLY_RETURNED',
}

export class OrdersListDTO extends IntersectionType(b2cDto, PaginationDto) {
  @ApiProperty({ required: false, default: [] })
  @IsOptional()
  orderIds?: string[];

  @ApiProperty({ required: false, default: '' })
  @IsOptional()
  customer?: string;

  @ApiProperty({
    required: false,
    default: [],
    enum: OrderStatusEnum,
  })
  statuses?: string[];

  @ApiProperty({ required: false, default: [], enum: PaymentChargeStatusEnum })
  @IsOptional()
  paymentStatus?: string[];

  @ApiProperty({
    required: false,
    default: DEFAULT_START_DATE,
    description: 'start date of orders -- date in ISOString format',
  })
  @IsOptional()
  startDate?: string;

  @ApiProperty({
    required: false,
    default: `${new Date().toISOString().slice(0, 10)}`,
    description: 'last date till orders -- date in ISOString format',
  })
  @IsOptional()
  endDate?: string;

  @ApiProperty({
    required: false,
    enum: ReturnStatusEnum,
  })
  returnStatus?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  userEmail?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  orderType?: string;
}

export class OrdersListFiltersDTO extends OrdersListDTO {
  @ApiProperty({ required: false })
  @IsOptional()
  shopId?: string;
}
