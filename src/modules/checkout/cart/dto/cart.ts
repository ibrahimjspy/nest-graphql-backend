import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class DeleteBundlesDto {
  @ApiProperty()
  @IsString()
  userEmail: string;

  @ApiProperty({ required: true, isArray: true, type: String })
  @IsArray()
  @ArrayMinSize(1)
  checkoutBundleIds: string[];
}

export class ReplaceBundleDto {
  @ApiProperty()
  @IsString()
  userEmail: string;

  @ApiProperty()
  @IsString()
  checkoutBundleId: string;

  @ApiProperty()
  @IsString()
  newBundleId: string;
}
