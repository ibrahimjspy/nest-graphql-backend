export interface CategoryListType {
  edges: {
    node: {
      name: string;
      id: string;
      slug: string;
      products: { totalCount: number };
      level?: number;
      metadata: {
        key: string;
        value: string;
      }[];
      ancestors?: CategoryListType;
      children: CategoryListType;
    };
  }[];
}

export interface CategoryType {
  node: {
    name: string;
    id: string;
    slug: string;
    metadata: {
      key: string;
      value: string;
    }[];
    level?: number;
    products: { totalCount: number };
    ancestors?: CategoryListType;
    children: CategoryListType;
  };
}
