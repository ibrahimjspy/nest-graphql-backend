export interface ShopType {
  id: string;
  name: string;
  email?: string;
  url?: string;
  madeIn: string;
  minOrder: number;
  description?: string;
  about: string;
  returnPolicy: string;
  storePolicy: string;
  shippingMethods: ShopShippingMethodType[];
}

export interface ShopShippingMethodType {
  id: string;
  shippingMethodId: string;
  shippingMethodTypeId: string;
}
