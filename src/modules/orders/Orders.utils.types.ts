export interface orderListInterface {
  paymentStatus?: string;
  status?: string;
  orderIds?: string;
  customer?: string;
  startDate?: string;
  endDate?: string;
}

export interface checkoutBundleInterfacec {
  __typename: string;
  checkoutId: string;
  userId: string;
  bundles: {
    checkoutBundleId: string;
    isSelected: boolean;
    quantity: number;
    bundle: {
      id: string;
      name: string;
      description: string;
      slug: string;
      product: {
        name: string;
        id: string;
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
          name: string;
          sku: string;
          media: {
            url: string;
          }[];
          attributes: {
            attribute: {
              name: string;
            };
            values: {
              name: string;
            }[];
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
        shippingMethods: {
          id: string;
          shippingMethodId: string;
          shippingMethodTypeId: string;
        }[];
      };
      selectedMethods: {
        method: {
          id: string;
          shippingMethodId: string;
          shippingMethodTypeId: string;
        };
        shop: {
          id: string;
          name: string;
        };
      }[];
    }[];
  }[];
}
[];

export interface orderSaleorInterface {
  id: string;
  lines: {
    id: string;
    variant: {
      id: string;
    };
  }[];
}

export interface checkoutBundleInterface {
  __typename: string;
  checkoutId: string;
  userId: string;
  bundles: {
    checkoutBundleId: string;
    isSelected: boolean;
    quantity: number;
    bundle: {
      id: string;
      name: string;
      description: string;
      slug: string;
      variants: {
        quantity: number;
        variant: {
          id: string;
          name: string;
          sku: null;
        };
      }[];
      shop: {
        id: string;
        name: string;
        madeIn: string;
        shippingMethods: any[];
      };
    };
  }[];
  selectedMethods: {
    method: {
      id: string;
      shippingMethodId: string;
      shippingMethodTypeId: string;
    };
    shop: {
      id: string;
      name: string;
    };
  }[];
}
