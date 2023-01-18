export interface OrderRefundInputInterface {
  orderId: string;
  orderLines: string;
  fulfillmentLines: string;
  amountToRefund: number;
}
