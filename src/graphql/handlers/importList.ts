import {
  graphqlCall,
  graphqlExceptionHandler,
  graphqlResultErrorHandler,
} from 'src/core/proxies/graphqlHandler';
import {
  deleteImportedProductsDTO,
  importProductsDTO,
} from 'src/modules/importList/dto/products';
import { deleteImportedProductMutation } from '../mutations/importList/deleteProducts';
import { importProductsMutation } from '../mutations/importList/addProducts';
import { getImportedProductsQuery } from '../queries/importList/products';

export const getImportedProductsHandler = async (
  shopId: string,
  productFilter,
): Promise<object> => {
  try {
    const response = await graphqlCall(
      getImportedProductsQuery(shopId, productFilter),
    );
    return response['importProducts'];
  } catch (error) {
    return graphqlExceptionHandler(error);
  }
};

export const importProductsHandler = async (
  productData: importProductsDTO,
): Promise<object> => {
  try {
    return await graphqlResultErrorHandler(
      await graphqlCall(importProductsMutation(productData)),
    );
  } catch (error) {
    return graphqlExceptionHandler(error);
  }
};

export const deleteImportedProductsHandler = async (
  productData: deleteImportedProductsDTO,
): Promise<object> => {
  try {
    const response = await graphqlResultErrorHandler(
      await graphqlCall(deleteImportedProductMutation(productData)),
      false,
    );
    return response['deleteImportedProduct'];
  } catch (error) {
    return graphqlExceptionHandler(error);
  }
};
