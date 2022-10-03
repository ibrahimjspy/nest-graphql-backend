export type countryType = {
  code: string;
  country: string;
};

export type addressType = {
  id: string;
  firstName: string;
  lastName: string;
  companyName: string;
  streetAddress1: string;
  streetAddress2?: string;
  city: string;
  cityArea?: string;
  postalCode: string;
  country: countryType;
  countryArea?: string;
  phone: string;
  isDefaultShippingAddress: boolean;
};
