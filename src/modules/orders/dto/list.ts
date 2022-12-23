import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginationDto } from 'src/graphql/dto/pagination.dto';

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

export class OrdersListDTO extends PaginationDto {
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
}
