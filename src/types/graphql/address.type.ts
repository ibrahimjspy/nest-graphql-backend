import { CountryCode } from 'src/graphql/enums';

export interface AddressInput {
  firstName: string;
  lastName: string;
  companyName: string;
  streetAddress1: string;
  streetAddress2?: string;
  city: string;
  cityArea?: string;
  postalCode: string;
  country: CountryCode;
  countryArea?: string;
  phone: string;
}
