export interface PaymentInfoInterface {
  token: string;
  checkoutId: string;
  userEmail: string;
  amount: number;
  paymentStatus: number;
  intentId: string;
}
