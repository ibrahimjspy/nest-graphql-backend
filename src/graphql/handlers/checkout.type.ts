export interface AddressDetailType {
  country: string;
  countryArea: string;
  firstName: string;
  lastName: string;
  streetAddress1: string;
  streetAddress2: string;
  phone: string;
  companyName: string;
  postalCode: string;
  city: string;
}

export interface BundleType {
  bundleId: string;
  quantity: number;
}

export interface LineType {
  variantId: string;
  quantity: number;
}
