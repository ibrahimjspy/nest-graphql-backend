export interface MarketplaceProductsResponseType {
  totalCount: number;
  edges: Array<{
    node: {
      productId: string;
    };
  }>;
}
export interface BundleCreateResponseType {
  status: number;
  data: {
    id: string;
    name: string;
    description: string;
    slug: string;
  };
}

export interface GetBundleResponseType {
  status: number;
  data: {
    id: string;
    productVariants: {
      productVariant: {
        id: string;
      };
      quantity: number;
    }[];
  };
}
