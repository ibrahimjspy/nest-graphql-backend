import {
  graphqlCall,
  graphqlExceptionHandler,
} from 'src/core/proxies/graphqlHandler';
import { categoriesFilter } from 'src/core/utils/categoryFilter';
import { menuCategoriesQuery } from 'src/graphql/queries/categories/menu';

export const menuCategoriesHandler = async (
  header: string,
): Promise<object> => {
  try {
    const categories = await graphqlCall(menuCategoriesQuery(), header);
    return categoriesFilter(categories);
  } catch (error) {
    return graphqlExceptionHandler(error);
  }
};

export const productCardSectionHandler = async (
  header: string,
): Promise<object> => {
  try {
    return await graphqlCall(menuCategoriesQuery(), header);
  } catch (error) {
    return graphqlExceptionHandler(error);
  }
};
