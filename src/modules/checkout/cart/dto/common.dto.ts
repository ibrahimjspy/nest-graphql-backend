import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class UserIdDto {
  @ApiProperty()
  userEmail: string;
}

export class GetCartDto {
  @ApiProperty({ type: String, description: 'saleor checkout id' })
  checkoutId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ obj, key }) => obj[key] === 'true')
  isSelected: boolean;
}

export enum OpenPackTransactionTypeEnum {
  /**
   * @description - whether we are replacing an open pack with another bundle with new variants
   */
  REPLACE = 'REPLACE',
  /**
   * @description - whether we are only updating quantity of bundle id
   */
  UPDATE = 'UPDATE',
}

export class UserEmailDto {
  @ApiProperty({ required: true })
  userEmail: string;
}
