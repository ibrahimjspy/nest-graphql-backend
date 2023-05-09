import {
  graphqlCall,
  graphqlExceptionHandler,
  graphqlResultErrorHandler,
} from 'src/core/proxies/graphqlHandler';
import RecordNotFound from 'src/core/exceptions/recordNotFound';
import { BundleType } from 'src/graphql/types/bundle.type';
import { getMyProductsQuery } from '../queries/product/myProducts';
import { deleteBulkProductsMutation } from '../mutations/product/bulkDelete';
import { productVariantStockUpdateMutation } from '../mutations/product/variantStockUpdate';
import {
  myProductsDTO,
  updateMyProductDTO,
} from 'src/modules/shop/dto/myProducts';
import { updateMyProductMutation } from '../mutations/product/updateMyProducts';
import { deleteBulkMediaMutation } from '../mutations/product/mediaBulkDelete';
import { shopProductIdsByCategoryIdQuery } from '../queries/product/shopProductIds';
import {
  GetBundlesDto,
  ProductDetailsDto,
  ProductFilterDto,
} from 'src/modules/product/dto/product.dto';
import { getBundlesQuery } from '../queries/product/getBundles';
import { getProductDetailsQuery } from '../queries/product/details';
import { MarketplaceProductsResponseType } from 'src/modules/product/Product.types';
import { popularItemsQuery } from '../queries/product/popularItems';
import { productsQuery } from '../queries/product/products';

export const productsHandler = async (
  filter: ProductFilterDto,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(productsQuery(filter)),
  );

  return response?.products;
};

export const popularItemsHandler = async (): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(popularItemsQuery()),
  );

  return response?.reportProductSales;
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

export const getShopProductsHandler = async (
  filter: ProductFilterDto,
  isb2c = false,
): Promise<MarketplaceProductsResponseType> => {
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

export const getProductDetailsHandler = async (
  filter: ProductDetailsDto,
  isB2c = false,
): Promise<object> => {
  try {
    return await graphqlCall(getProductDetailsQuery(filter, isB2c), '', isB2c);
  } catch (error) {
    return graphqlExceptionHandler(error);
  }
};
