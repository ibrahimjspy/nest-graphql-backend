import {
  graphqlCall,
  graphqlResultErrorHandler,
} from 'src/core/proxies/graphqlHandler';
import { categoriesQuery } from '../queries/categories/categories';
import { shopCategoryIdsQuery } from '../queries/categories/shopCategoryIds';
import { syncCategoriesQuery } from '../queries/categories/syncCategories';
import { SyncCategoriesDto } from 'src/modules/categories/dto/categories';
import { CategoryListType } from 'src/modules/categories/Categories.types';

export const shopCategoryIdsHandler = async (
  shopId: string,
  isb2c = false,
): Promise<{ categoryIds: string[] }> => {
  const userToken = '';
  const response = await graphqlResultErrorHandler(
    await graphqlCall(shopCategoryIdsQuery(shopId, isb2c), userToken, isb2c),
  );
  return response['getCategoriesByShop'];
};

export const categoriesHandler = async (
  filter,
  isb2c = false,
): Promise<CategoryListType> => {
  const userToken = '';
  const response = await graphqlResultErrorHandler(
    await graphqlCall(categoriesQuery(filter, isb2c), userToken, isb2c),
  );
  return response['categories'];
};

export const syncCategoriesHandler = async (
  syncCategoriesFilter: SyncCategoriesDto,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      syncCategoriesQuery(
        syncCategoriesFilter.categoryLevel,
        syncCategoriesFilter,
      ),
    ),
  );
  return response['categories'];
};
