export interface CategoryListType {
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
