import * as ProductQueries from 'src/graphql/queries/product';
import {
  graphqlCall,
  graphqlExceptionHandler,
  graphqlResultErrorHandler,
} from 'src/core/proxies/graphqlHandler';
import RecordNotFound from 'src/core/exceptions/recordNotFound';
import { BundleType } from 'src/graphql/types/bundle.type';
import { PaginationDto } from '../dto/pagination.dto';
import { getProductIdsByVariantIdsQuery } from '../queries/product/productIdsByVariantIds';
import { hasNextPage } from '../utils/orders';
import { getUniqueProductIds } from '../utils/product';
import { getMyProductsQuery } from '../queries/product/myProducts';
import { deleteBulkProductsMutation } from '../mutations/product/bulkDelete';
import { productVariantStockUpdateMutation } from '../mutations/product/variantStockUpdate';
import {
  myProductsDTO,
  updateMyProductDTO,
} from 'src/modules/shop/dto/myProducts';
import { updateMyProductMutation } from '../mutations/product/updateMyProducts';
import { deleteBulkMediaMutation } from '../mutations/product/mediaBulkDelete';
import { getStoredProductsListQuery } from '../queries/product/storedProductsList';
import { shopProductIdsByCategoryIdQuery } from '../queries/product/shopProductIdsByCategoryId';
import { GetBundlesDto } from 'src/modules/product/dto/product.dto';
import { getBundlesQuery } from '../queries/product/getBundles';
import { getProductSlugQuery } from '../queries/product/productSlug';

export const productListPageHandler = async (
  filter,
  isb2c = false,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(ProductQueries.productListPageQuery(filter, isb2c)),
  );
  return response['products'];
};

export const singleProductDetailsHandler = async (
  slug: string,
): Promise<object> => {
  try {
    return await graphqlCall(ProductQueries.productDetailsQuery(slug));
  } catch (error) {
    return graphqlExceptionHandler(error);
  }
};

export const productCardsByCategoriesHandler = async (
  id: string,
): Promise<object> => {
  try {
    const response = await graphqlCall(
      ProductQueries.productCardsByListIdQuery(id),
    );
    return response['products'];
  } catch (error) {
    return graphqlExceptionHandler(error);
  }
};

export const productsHandler = async (filter): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(ProductQueries.productsQuery(filter)),
  );

  return response?.products;
};

export const popularItemsHandler = async (): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(ProductQueries.popularItemsQuery()),
  );

  return response?.reportProductSales;
};

/**
 * DEPRECATED: use `productsHandler` method instead
 */
export const productCardHandler = async (): Promise<object> => {
  try {
    const response = await graphqlCall(
      ProductQueries.productCardsDefaultQuery(),
    );
    return response['products'];
  } catch (error) {
    return graphqlExceptionHandler(error);
  }
};

export const variantsIdsByProductIdsHandler = async (
  productIds: Array<string>,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(ProductQueries.variantsIdsByProductIdsQuery(productIds)),
  );

  if (!response['products']?.['edges']?.['length']) {
    throw new RecordNotFound('Products');
  }

  return response['products'];
};

export const getBundlesHandler = async (
  filter: GetBundlesDto,
): Promise<BundleType[]> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(getBundlesQuery(filter)),
  );
  if (!response['bundles']['edges']['length']) {
    throw new RecordNotFound('Bundles');
  }

  return response['bundles'];
};

export const getLegacyMappingHandler = async (productIds, shop_ids) => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(ProductQueries.productMappingQuery(productIds, shop_ids)),
  );
  return response;
};

/**
 * this handler takes variant ids and returns product ids which are unique
 */
export const getProductIdsByVariantIdsHandler = async (
  variantIds: string[],
  after = '',
) => {
  let productIds = [];
  const getProductVariants = await graphqlResultErrorHandler(
    await graphqlCall(getProductIdsByVariantIdsQuery(variantIds), after),
  );
  productIds = productIds.concat(
    getProductVariants['productVariants']['edges'],
  );
  const nextPage = hasNextPage(getProductVariants['productVariants'].pageInfo);
  if (nextPage) {
    const getNextProductVariants = await getProductIdsByVariantIdsHandler(
      variantIds,
      nextPage,
    );
    productIds = productIds.concat(
      getNextProductVariants['productVariants']['edges'],
    );
  }
  return getUniqueProductIds(productIds);
};

export const getMyProductsHandler = async (
  productIds: string[],
  filter: myProductsDTO,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(getMyProductsQuery(productIds, filter, true), '', true),
  );
  return response['products'];
};

export const deleteBulkProductHandler = async (
  productIds: string[],
  token: string,
  isb2c = false,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      deleteBulkProductsMutation(productIds, isb2c),
      token,
      isb2c,
    ),
  );
  return response['productBulkDelete'];
};

export const updateProductVariantStockHandler = async (
  productVariantId: string,
  quantity: number,
  token: string,
  isb2c = false,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      productVariantStockUpdateMutation(productVariantId, quantity),
      token,
      isb2c,
    ),
  );
  return response['productVariantStocksUpdate'];
};

export const updateMyProductHandler = async (
  productUpdateInput: updateMyProductDTO,
  token: string,
  isb2c = false,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      updateMyProductMutation(productUpdateInput, isb2c),
      token,
      isb2c,
    ),
  );
  return response['productUpdate'];
};

export const deleteBulkMediaHandler = async (
  mediaIds: string[],
  token: string,
  isb2c = false,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(deleteBulkMediaMutation(mediaIds, isb2c), token, isb2c),
  );
  return response['productMediaBulkDelete'];
};

export const getStoredProductListHandler = async (
  productIds: string[],
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(getStoredProductsListQuery(productIds)),
  );
  return response['products'];
};

export const shopProductIdsByCategoryIdHandler = async (
  filter,
  isb2c = false,
): Promise<{ productIds: string[] }> => {
  const userToken = '';
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      shopProductIdsByCategoryIdQuery(filter, isb2c),
      userToken,
      isb2c,
    ),
  );
  return response['getProductsByShop'];
};

export const getProductSlugHandler = async (
  productId: string,
  isb2c = false,
): Promise<object> => {
  const token = '';
  const response = await graphqlResultErrorHandler(
    await graphqlCall(getProductSlugQuery(productId), token, isb2c),
  );
  return response['product'];
};
