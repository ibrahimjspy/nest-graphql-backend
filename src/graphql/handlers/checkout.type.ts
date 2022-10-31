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

export interface CheckoutBundleInputType {
  bundleId: string;
  quantity: number;
  lines?: string[];
}

export interface LineType {
  variantId: string;
  quantity: number;
}
