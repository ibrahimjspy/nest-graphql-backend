import {
  graphqlCall,
  graphqlExceptionHandler,
} from 'src/public/graphqlHandler';
import { menuCategoriesQuery } from 'src/graphql/queries/categories/menu';

export const menuCategoriesHandler = async (): Promise<object> => {
  try {
    return await graphqlCall(menuCategoriesQuery());
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

export const productCardSectionHandler = async (): Promise<object> => {
  try {
    return await graphqlCall(menuCategoriesQuery());
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};
