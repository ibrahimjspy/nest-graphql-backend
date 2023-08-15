export interface CheckoutShippingMethodType {
  status: number;
  data: {
    id: string;
    deliveryMethod: {
      id: string;
      metadata: {
        key: string;
        value: string;
      }[];
    };
    shippingMethods: {
      id: string;
      name: string;
      description: any;
      maximumDeliveryDays: any;
      minimumDeliveryDays: any;
      metadata: {
        key: string;
        value: string;
      }[];
    }[];
  };
}

export interface MappedShippingMethodsType {
  checkoutId: string;
  shippingMethods: {
    shippingMethodId: string;
    name: string;
    metadata: {
      key: string;
      value: string;
    }[];
  }[];
}
