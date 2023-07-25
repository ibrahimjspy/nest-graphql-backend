import {
  graphqlCall,
  graphqlResultErrorHandler,
} from 'src/core/proxies/graphqlHandler';
import { categoriesQuery } from '../queries/categories/categories';
import { shopCategoryIdsQuery } from '../queries/categories/shopCategoryIds';
import { syncCategoriesQuery } from '../queries/categories/syncCategories';
import {
  SyncCategoriesDto,
  VendorCategoriesDto,
} from 'src/modules/categories/dto/categories';
import { CategoryListType } from 'src/modules/categories/Categories.types';
import { menuCategoriesQuery } from '../queries/categories/menu';
import { vendorCategoriesQuery } from '../queries/categories/vendorCategories';
import { PaginationDto } from '../dto/pagination.dto';
import { collectionsQuery } from '../queries/categories/collections';
import { getGraphqlAllAccessToken } from 'src/core/utils/helpers';

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

export const menuCategoriesHandler = async (): Promise<CategoryListType> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(menuCategoriesQuery()),
  );
  return response['categories'];
};

export const vendorCategoriesHandler = async (
  filter: VendorCategoriesDto,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(vendorCategoriesQuery(filter)),
  );
  return response['categories'];
};

export const collectionsHandler = async (
  pagination: PaginationDto,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(collectionsQuery(pagination), getGraphqlAllAccessToken()),
  );
  return response['collections'];
};
