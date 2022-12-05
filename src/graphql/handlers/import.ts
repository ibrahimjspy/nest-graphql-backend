import {
  graphqlCall,
  graphqlExceptionHandler,
  graphqlResultErrorHandler,
} from 'src/core/proxies/graphqlHandler';
import { importProductsDTO } from 'src/modules/Import/dto/products';
import { importProductsMutation } from '../mutations/import/products';
import { getImportedProductsQuery } from '../queries/import/products';

export const getImportedProductsHandler = async (
  shopId: string,
  productFilter,
): Promise<object> => {
  try {
    return await graphqlCall(getImportedProductsQuery(shopId, productFilter));
  } catch (error) {
    return graphqlExceptionHandler(error);
  }
};

export const importProductsHandler = async (
  productData: importProductsDTO,
): Promise<string> => {
  try {
    return await graphqlResultErrorHandler(
      graphqlCall(importProductsMutation(productData)),
    );
  } catch (error) {
    return graphqlExceptionHandler(error);
  }
};
