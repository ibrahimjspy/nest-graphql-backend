import { graphqlCall } from 'src/public/graphqlHandler';
import { menuCategoriesQuery } from 'src/graphql/queries/categories/menu';
import { productSectionsQuery } from 'src/graphql/queries/categories/productSections';

export const menuCategoriesHandler = async (): Promise<object> => {
  return await graphqlCall(menuCategoriesQuery());
};

export const productCardSectionHandler = async (): Promise<object> => {
  return await graphqlCall(productSectionsQuery());
};
