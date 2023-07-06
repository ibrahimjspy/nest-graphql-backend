export interface vouchersType {
  edges: {
    node: {
      id: string;
      code: string;
      channelListings: {
        discountValue: number;
        minSpent: {
          amount: number;
        };
      }[];
    };
  }[];
}

export interface promotionResponseType {
  errors: any[];
  checkout: {
    id: string;
    discount: {
      amount: number;
    };
    shippingPrice: {
      gross: {
        amount: number;
      };
    };
    subtotalPrice: {
      gross: {
        amount: number;
      };
    };
    totalPrice: {
      gross: {
        amount: number;
      };
    };
  };
}

export interface UpdateDeliveryMethodInterface {
  id: string;
  voucherCode: string;
  deliveryMethod: {
    id: string;
    name: string;
    metadata: {
      key: string;
      value: string;
    }[];
  };
  totalPrice: {
    gross: {
      amount: number;
    };
  };
  discount: {
    amount: number;
  };
  subtotalPrice: {
    gross: {
      amount: number;
    };
  };
}
