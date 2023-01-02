import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/graphql/dto/pagination.dto';

export enum OrderReturnSortFieldEnum {
  CREATED_AT = 'CREATED_AT',
}

export enum OrderReturnDirectionEnum {
  DESC = 'DESC',
  ASC = 'ASC',
}
export class OrderReturnFilterDTO extends PaginationDto {
  @ApiProperty({ required: false, default: 'default-channel' })
  @IsOptional()
  channel?: string;

  @ApiProperty({
    enum: OrderReturnSortFieldEnum,
    required: false,
    default: OrderReturnSortFieldEnum.CREATED_AT,
  })
  @IsEnum(OrderReturnSortFieldEnum)
  @IsOptional()
  sort_field: OrderReturnSortFieldEnum;

  @ApiProperty({
    enum: OrderReturnDirectionEnum,
    required: false,
    default: OrderReturnDirectionEnum.DESC,
  })
  @IsEnum(OrderReturnDirectionEnum)
  @IsOptional()
  sort_order: OrderReturnDirectionEnum;
}