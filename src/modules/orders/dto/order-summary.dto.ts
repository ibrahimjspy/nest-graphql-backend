export class OrderSummaryResponseDto {
  dailySales?: number;
  readyToFulfill?: number;
  ordersToPickup?: number;
  ordersReturned?: number;
  totalOrders?: number;
}

export class ShopOrderReportResponseDto {
  totalEarnings?: number;
  ordersProcessing?: number;
  ordersShipped?: number;
  ordersCancelled?: number;
  ordersReturnsRequested?: number;
}
