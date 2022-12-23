import { IsEmail } from 'class-validator';

export class RetailerDto {
  @IsEmail()
  email: string;
}
