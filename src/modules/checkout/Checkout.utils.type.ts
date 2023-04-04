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
  token: string;
}

export interface SaleorCheckoutInterface {
  id: string;
  metadata: {
    key: string;
    value: string;
  }[];
  totalPrice: {
    gross: {
      amount: number;
    };
  };
  shippingMethods: {
    id: string;
    name: string;
    active: boolean;
    price: {
      amount: number;
      currency: string;
    };
  }[];
  deliveryMethod: {
    __typename: string;
    id: string;
    name: string;
    metadata: {
      key: string;
      value: string;
    }[];
  };
  lines: {
    id: string;
    quantity: number;
    variant: {
      id: string;
    };
  }[];
}
