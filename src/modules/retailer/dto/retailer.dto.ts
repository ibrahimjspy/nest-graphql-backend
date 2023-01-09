import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RetailerEmailDto {
  @IsEmail()
  email: string;
}

export class RetailerRegisterDto {
  email: string;
  password: string;
  given_name: string;
  family_name: string;
  job_title: string;
  country: string;
  state: string;
  company_name: string;
  phone_number: string;
  address1?: string;
  address2?: string;
  zipcode?: string;
  city?: string;
  website?: string;
  resale_certificate?: string;
  seller_permit_image?: string;
  accept_terms: boolean;
  job_title_id: string;
  sellers_permit_id: string;
  confirm_password: string;
}

export class shopIdDto {
  @ApiProperty()
  shopId: string;
}

export class dateDto {
  @ApiProperty()
  fromDate: string;
  toDate: string;
}
