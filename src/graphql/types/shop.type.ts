export interface FieldsType {
  name: string;
  values: string[];
}
export interface ShopType {
  id: string;
  name: string;
  user?: string;
  email?: string;
  url?: string;
  madeIn: string;
  minOrder: number;
  description?: string;
  about: string;
  returnPolicy: string;
  storePolicy: string;
  shippingMethods: ShopShippingMethodType[];
  fields?: FieldsType[];
}

export interface ShopShippingMethodType {
  id: string;
  shippingMethodId: string;
  shippingMethodTypeId: string;
}
