export interface CategoryListType {
  edges: {
    node: {
      name: string;
      id: string;
      slug: string;
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
