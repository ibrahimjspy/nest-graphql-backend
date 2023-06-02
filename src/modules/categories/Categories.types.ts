export interface CategoryListType {
  edges: {
    node: {
      name: string;
      id: string;
      slug: string;
      products: { totalCount: number };
      level?: number;
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
    level?: number;
    products: { totalCount: number };
    ancestors?: CategoryListType;
    children: CategoryListType;
  };
}
