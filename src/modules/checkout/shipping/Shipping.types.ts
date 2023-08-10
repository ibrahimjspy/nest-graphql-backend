export interface CheckoutShippingMethodType {
  status: number;
  data: {
    id: string;
    deliveryMethod: {
      id: string;
      metadata: any[];
    };
    shippingMethods: {
      id: string;
      name: string;
      description: any;
      maximumDeliveryDays: any;
      minimumDeliveryDays: any;
    }[];
  };
}

export interface MappedShippingMethodsType {
  checkoutId: string;
  shippingMethods: {
    shippingMethodId: string;
    name: string;
  }[];
}
