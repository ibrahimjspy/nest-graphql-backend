export interface CategoryListType {
  edges: {
    node: {
      name: string;
      id: string;
      slug: string;
      products: { totalCount: number };
      children: {
        edges: {
          node: {
            name: string;
            id: string;
            products: { totalCount: number };
            slug: string;
            children: {
              edges: {
                node: {
                  name: string;
                  id: string;
                  slug: string;
                  products: { totalCount: number };
                };
              }[];
            };
          };
        }[];
      };
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
    ancestors?: CategoryListType;
    children: CategoryListType;
  };
}
