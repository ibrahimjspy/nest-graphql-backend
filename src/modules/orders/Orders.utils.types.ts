export interface orderListInterface {
  paymentStatus?: string;
  status?: string;
  orderIds?: string;
  customer?: string;
  startDate?: string;
  endDate?: string;
}

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
          sku: string;
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
