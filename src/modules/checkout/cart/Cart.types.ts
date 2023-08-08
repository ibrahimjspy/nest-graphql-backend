export interface CheckoutBundleInterface {
  checkoutBundleId: string;
  isSelected: boolean;
  quantity: number;
  price: number;
  checkoutId: string;
  bundle: {
    id: string;
    name: string;
    isOpenBundle: boolean;
    description: string;
    slug: string;
    product: {
      id: string;
      description: string;
      name: string;
      slug: string;
      metadata: {
        key: string;
        value: string;
      }[];
      thumbnail: {
        url: string;
      };
      media: {
        url: string;
      }[];
    };
    productVariants: {
      quantity: number;
      productVariant: {
        id: string;
        sku: string;
        attributes: {
          attribute: {
            name: string;
          };
          values: {
            name: string;
          }[];
        }[];
        media: {
          url: string;
        }[];
        pricing: {
          price: {
            net: {
              amount: number;
              currency: string;
            };
          };
          onSale: boolean;
          discount: null;
        };
      };
    }[];
    shop: {
      id: string;
      name: string;
      madeIn: string;
      minOrder: number;
      fields: {
        name: string;
        values: string[];
      }[];
      shippingMethods: {
        id: string;
        shippingMethodId: string;
        shippingMethodTypeId: string;
      }[];
    };
  };
}

export interface CartResponseInterface {
  status: number;
  data: {
    __typename: string;
    userEmail: string;
    totalAmount: number;
    subTotal: number;
    taxes: number;
    discounts: number;
    checkoutId: string;
    checkoutBundles: CheckoutBundleInterface[];
    selectedMethods: any[];
  };
}

export interface UpdateMarketplaceCheckoutIdType {
  checkoutId: string;
  bundleId: string;
}

export interface UpdateMarketplaceCheckoutType {
  __typename: string;
  userEmail: string;
  totalAmount: number;
  subTotal: number;
  taxes: number;
  discounts: number;
  checkoutIds: string[];
  checkoutBundles: CheckoutBundleInterface[];
}
