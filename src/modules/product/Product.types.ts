export interface ShopProductIdsReponseType {
  edges: Array<{
    node: {
      productId: string;
    };
  }>;
}
