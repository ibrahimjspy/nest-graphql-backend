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
  metadata: {
    key: string;
    value: string;
  }[];
  maximumDeliveryDays: any;
  minimumDeliveryDays: any;
}
