import { graphqlCall } from 'src/public/graphqlHandler';
import { menuCategoriesQuery } from 'src/graphql/queries/categories/menu';
import { productSectionsQuery } from 'src/graphql/queries/categories/productSections';

export const menuCategoriesHandler = (): Promise<object> => {
  return graphqlCall(menuCategoriesQuery());
};

export const productCardSectionHandler = (): Promise<object> => {
  return graphqlCall(productSectionsQuery());
};
