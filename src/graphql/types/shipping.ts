export interface ShippingMethodSaleorType {
  channelListings: {
    channel: {
      id: string;
    };
    price: {
      amount: number;
    };
  }[];
  id: string;
  name: string;
  description: any;
  maximumDeliveryDays: any;
  minimumDeliveryDays: any;
}
