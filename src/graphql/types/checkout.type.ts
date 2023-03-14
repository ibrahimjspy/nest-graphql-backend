export interface CheckoutBundlesDto {
  userEmail?: string;
  checkoutId?: string;
  throwException?: boolean;
  productDetails?: boolean;
  isSelected?: boolean;
  token: string;
}
