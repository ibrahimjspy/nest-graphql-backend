import {
  graphqlCall,
  graphqlExceptionHandler,
} from 'src/core/proxies/graphqlHandler';
import { menuCategoriesQuery } from 'src/graphql/queries/categories/menu';

export const menuCategoriesHandler = async (): Promise<object> => {
  try {
    const response = await graphqlCall(menuCategoriesQuery());
    return response?.categories?.edges?.slice(1);
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
