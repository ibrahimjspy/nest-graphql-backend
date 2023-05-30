export interface CategoryListType {
  edges: {
    node: {
      name: string;
      id: string;
      slug: string;
      level?: number;
      ancestors?: CategoryListType,
      children: {
        edges: {
          node: {
            name: string;
            id: string;
            slug: string;
            children: {
              edges: {
                node: {
                  name: string;
                  id: string;
                  slug: string;
                };
              }[];
            };
          };
        }[];
      };
    };
  }[];
}
