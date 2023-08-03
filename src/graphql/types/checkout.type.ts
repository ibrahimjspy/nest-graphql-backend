export interface CheckoutBundlesDto {
  userEmail?: string;
  checkoutIds?: string[];
  throwException?: boolean;
  productDetails?: boolean;
  isSelected?: boolean;
  token: string;
}

export interface FailedOrderInterface {
  email?: string;
  source: string;
  orderId: string;
  exception: string;
  errorShortDesc: string;
  orderPayload: any;
}

export interface MarketplaceShippingMethodsType {
  checkoutBundles: {
    checkoutId: string;
    bundle: {
      shop: {
        shippingMethods: {
          id: string;
          shippingMethodId: string;
          shippingMethodTypeId: string;
        }[];
      };
    };
  }[];
}
