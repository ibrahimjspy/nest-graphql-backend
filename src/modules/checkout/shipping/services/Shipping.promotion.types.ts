export interface vouchersType {
  edges: {
    node: {
      id: string;
      code: string;
      channelListings: {
        discountValue: number;
        minSpent: {
          amount: number;
        };
      }[];
    };
  }[];
}
