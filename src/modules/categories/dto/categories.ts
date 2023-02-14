import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class shopIdDTO {
  @ApiProperty({ type: String, required: true })
  shopId: string;
}

export class b2cDTO {
  @ApiProperty({ required: false, default: false })
  @IsBoolean()
  @Transform(({ obj, key }) => obj[key] === 'true')
  public isB2c: boolean;
}