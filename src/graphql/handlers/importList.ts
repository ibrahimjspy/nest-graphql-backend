import {
  graphqlCall,
  graphqlExceptionHandler,
  graphqlResultErrorHandler,
} from 'src/core/proxies/graphqlHandler';
import { importProductsDTO } from 'src/modules/importList/dto/products';
import { importProductsMutation } from '../mutations/importList/products';
import { getImportedProductsQuery } from '../queries/importList/products';

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
): Promise<object> => {
  try {
    return await graphqlResultErrorHandler(
      graphqlCall(importProductsMutation(productData)),
    );
  } catch (error) {
    return graphqlExceptionHandler(error);
  }
};
