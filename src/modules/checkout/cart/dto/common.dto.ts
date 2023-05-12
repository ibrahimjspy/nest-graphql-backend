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
