import {
  graphqlCall,
  graphqlExceptionHandler,
} from 'src/core/proxies/graphqlHandler';
import { categoriesFilter } from 'src/core/utils/categoryFilter';
import { menuCategoriesQuery } from 'src/graphql/queries/categories/menu';

export const menuCategoriesHandler = async (): Promise<object> => {
  try {
    const categories = await graphqlCall(menuCategoriesQuery());
    return categoriesFilter(categories);
  } catch (error) {
    return graphqlExceptionHandler(error);
  }
};

export const productCardSectionHandler = async (): Promise<object> => {
  try {
    return await graphqlCall(menuCategoriesQuery());
  } catch (error) {
    return graphqlExceptionHandler(error);
  }
};
