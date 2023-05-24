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
  sharove_order_id: string;
  stripe_payment_method_id: string;
  billing: OsBillingAddressType;
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
