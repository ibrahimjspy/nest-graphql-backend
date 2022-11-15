class SingleOrderDto {
  id: string;
  orderId: string;
  fulfillmentStatus: string;
  number: string;
  created: string;
  userEmail: string;
  shopName: string;
  shopId: string;
  currency: string;
  totalAmount: number;
}

export class ShopOrdersListDto {
  orders: SingleOrderDto[];
}
