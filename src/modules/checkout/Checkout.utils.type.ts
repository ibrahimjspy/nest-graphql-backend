import { BundleType } from 'src/graphql/types/bundle.type';

export interface CheckoutShippingMethodType {
  checkoutShippingMethodId: string;
}

export interface CheckoutBundleType {
  checkoutBundleId: string;
  quantity: number;
  bundle: BundleType;
  selectedMethods: CheckoutShippingMethodType[];
}

export interface MarketplaceCheckoutType {
  userId: string;
  checkoutId: string;
  bundles: CheckoutBundleType[];
}

export interface UnSelectBundlesType {
  userId: string;
  bundleIds: string[];
  checkoutBundleIds: string[];
  headers: string;
}
