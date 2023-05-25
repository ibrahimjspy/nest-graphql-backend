import { ProductIdsMappingType } from 'src/external/endpoints/b2bMapping.types';
import { OsBundlesType } from 'src/external/services/osOrder/osOrder.types';
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
  preAuth: {
    gross: {
      amount: number;
    };
  };
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

export interface ProductType {
  id: string;
  color: string;
  size: string;
  quantity: number;
}

export interface OsOrderTranformType {
  orderNumber: string;
  b2cProducts: ProductType[];
  osProductMapping: ProductIdsMappingType;
  b2bProductMapping: ProductIdsMappingType;
  OsShippingAddressId: number;
  osProductsBundles: OsBundlesType[];
}

export interface MetadataType {
  key: string;
  value: string;
}

export interface attributeType {
  attribute: {
    name: string;
  };
  values: Array<{
    name: string;
  }>;
}

export interface OsOrderResponseInterface {
  data: {
    orders: {
      order_number: string;
      order_amount: number;
      order_status: {
        is_held: boolean;
        status_id: number;
        status_alias: string;
      };
      fulfillment: string;
      payment: {
        auth_form_required: boolean;
        payment_id: string;
        payment_method_alias: string;
      };
      stock_type: string;
    }[];
    sharove_order_id: string;
    pre_auth_vendors: string[];
  };
  message: any;
  status: string;
}
