export interface CountryType {
  code: string;
  country: string;
}

export interface AddressType {
  id: string;
  firstName: string;
  lastName: string;
  companyName: string;
  streetAddress1: string;
  streetAddress2?: string;
  city: string;
  cityArea?: string;
  postalCode: string;
  country: CountryType;
  countryArea?: string;
  phone: string;
  isDefaultShippingAddress: boolean;
}
