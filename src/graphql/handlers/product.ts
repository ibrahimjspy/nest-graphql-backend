import * as ProductQueries from 'src/graphql/queries/product';
import {
  graphqlCall,
  graphqlExceptionHandler,
  graphqlResultErrorHandler,
} from 'src/core/proxies/graphqlHandler';
import RecordNotFound from 'src/core/exceptions/recordNotFound';
import { getBundleIds } from 'src/modules/product/Product.utils';
import { CheckoutBundleInputType } from 'src/graphql/handlers/checkout.type';
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

export const productListPageHandler = async (
  id: string,
  pagination: PaginationDto,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(ProductQueries.productListPageQuery(id, pagination)),
  );
  return response;
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
    return await graphqlCall(ProductQueries.productCardsByListIdQuery(id));
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
    return await graphqlCall(ProductQueries.productCardsDefaultQuery());
  } catch (error) {
    return graphqlExceptionHandler(error);
  }
};

export const bundlesByVariantsIdsHandler = async (
  variantIds: Array<string>,
): Promise<Array<object>> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      ProductQueries.productBundlesByVariantIdQuery(variantIds),
    ),
  );
  if (!response['bundles']['edges']['length']) {
    throw new RecordNotFound('Bundles');
  }
  return response['bundles']['edges'];
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

export const bundlesByBundleIdsHandler = async (
  bundles: Array<CheckoutBundleInputType>,
  token: string,
): Promise<BundleType[]> => {
  const bundleIds = getBundleIds(bundles);
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      ProductQueries.productBundlesByBundleIdQuery(bundleIds),
      token,
    ),
  );

  if (!response['bundles']['length']) {
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
    await graphqlCall(
      getMyProductsQuery(productIds, filter, 'true'),
      '',
      'true',
    ),
  );
  return response['products'];
};

export const deleteBulkProductHandler = async (
  productIds: string[],
  token: string,
  isb2c = '',
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
  isb2c = '',
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
  isb2c = '',
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
  isb2c = '',
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(deleteBulkMediaMutation(mediaIds, isb2c), token, isb2c),
  );
  return response['productMediaBulkDelete'];
};
