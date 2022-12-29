export class OrderSummaryResponseDto {
  dailySales?: number;
  readyToFulfill?: number;
  ordersToPickup?: number;
  ordersReturned?: number;
  totalOrders?: number;
}
