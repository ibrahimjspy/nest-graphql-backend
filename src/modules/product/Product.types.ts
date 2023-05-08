export interface MarketplaceProductsResponseType {
  totalCount: number;
  edges: Array<{
    node: {
      productId: string;
    };
  }>;
}
