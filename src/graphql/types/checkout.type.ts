export interface CheckoutBundlesDto {
  userEmail?: string;
  checkoutId?: string;
  throwException?: boolean;
  productDetails?: boolean;
  isSelected?: boolean;
  token: string;
}

export interface FailedOrderInterface {
  source: string;
  orderId: string;
  exception: string;
  errorShortDesc: string;
  orderPayload: any;
}
