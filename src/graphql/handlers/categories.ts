import {
  graphqlCall,
  graphqlExceptionHandler,
  graphqlResultErrorHandler,
} from 'src/core/proxies/graphqlHandler';
import { menuCategoriesQuery } from 'src/graphql/queries/categories/menu';
import { categoriesDTO } from 'src/modules/categories/dto/categories';
import { categoriesQuery } from '../queries/categories/categories';
import { shopCategoryIdsQuery } from '../queries/categories/shopCategoryIds';

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

export const shopCategoryIdsHandler = async (
  shopId: string,
  isb2c = false,
): Promise<{categoryIds: string[]}> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(shopCategoryIdsQuery(shopId, isb2c), '', isb2c),
  );
  return response['getCategoriesByShop'];
};

export const categoriesHandler = async (
  categoryIds: string[],
  filter: categoriesDTO,
  isb2c = false,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(categoriesQuery(categoryIds, filter, isb2c), '', isb2c),
  );
  return response['categories'];
};