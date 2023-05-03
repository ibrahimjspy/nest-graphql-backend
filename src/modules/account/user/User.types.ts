export interface Auth0UserDetailType {
  given_name: string;
  family_name: string;
  sub?: string;
  email?: string;
  user_metadata?: {
    job_title_id?: string;
    sellers_permit_id?: string;
    phone_number?: string;
    resale_certificate?: string;
    seller_permit_image?: string;
    address?: string;
    stripe_customer_id?: string;
  };
}

export type getUserByTokenType = (token: string) => Auth0UserDetailType;
