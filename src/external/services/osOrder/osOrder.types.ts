import { ProductIdsMappingType } from "src/external/endpoints/b2bMapping.types";

export type OsOrderItem = {
  item_id: string;
  color_id: string;
  pack_qty: number;
  stock_type: string;
  memo: string;
  sms_number: string;
  spa_id: number;
  spm_name: string;
  store_credit: string;
  signature_requested: string;
  shoe_size_id?: number;
  size_run?: number[];
};

export type OsBillingAddressType = {
  first_name: string;
  last_name: string;
  address1: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  phone_number?: string;
};

export interface OsOrderPayloadType {
  orders: Array<OsOrderItem>;
  payment_type: string;
  spa_id: number;
  sharove_order_id: number;
  stripe_payment_method_id: string;
  billing: OsBillingAddressType;
  order_type: string;
}

export interface OsShippingAddressType {
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipcode: string;
  user_id: string;
  company_name: string;
  country: string;
  first_name: string;
  last_name: string;
  nick_name: string;
  phone_number: string;
}

export interface OsBundlesType {
  is_restock: boolean;
  min_broken_pack_order_qty: number;
  is_shoes: boolean;
  brand: {
    fulfillment: {
      min_order_amount: number;
    };
  };
  colors: Array<{
    color_id: string;
    name: string;
    item_id: string;
  }>;
  price: {
    is_sale: boolean;
    price: number;
    regular_price: number;
    sale_price: number;
  };
  is_active: boolean;
  is_broken_pack: boolean;
  id: string;
  size_chart: {
    size: string[];
    pack: number[];
    total: number;
    size_chart: {
      [key: string]: number;
    };
  };
  pre_order: {
    is_pre_order: boolean;
  };
}

export interface ProductType {
  id: string;
  color: string;
  size: string;
  quantity: number;
}
export interface OsOrderTranformType {
  orderNumber: number;
  b2cProducts: ProductType[];
  osProductMapping: ProductIdsMappingType;
  b2bProductMapping: ProductIdsMappingType;
  OsShippingAddressId: number;
  osProductsBundles: OsBundlesType[];
}
