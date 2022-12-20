import {
  graphqlCall,
  graphqlExceptionHandler,
  graphqlResultErrorHandler,
} from 'src/core/proxies/graphqlHandler';
import { deleteFromProductStoreMutation } from '../mutations/productStore/deleteProducts';
import { addToProductStoreMutation } from '../mutations/productStore/addProducts';
import { getStoredProductsQuery } from '../queries/productStore/products';
import {
  addToProductStoreDTO,
  deleteFromProductStoreDTO,
} from 'src/modules/productStore/dto/products';

export const getStoredProductsHandler = async (
  shopId: string,
  productFilter,
): Promise<object> => {
  try {
    const response = await graphqlCall(
      getStoredProductsQuery(shopId, productFilter),
    );
    return response['storedProducts'];
  } catch (error) {
    return graphqlExceptionHandler(error);
  }
};

export const addToProductStoreHandler = async (
  productData: addToProductStoreDTO,
): Promise<object> => {
  try {
    return await graphqlResultErrorHandler(
      await graphqlCall(addToProductStoreMutation(productData)),
    );
  } catch (error) {
    return graphqlExceptionHandler(error);
  }
};

export const deleteFromProductStoreHandler = async (
  productData: deleteFromProductStoreDTO,
): Promise<object> => {
  try {
    const response = await graphqlResultErrorHandler(
      await graphqlCall(deleteFromProductStoreMutation(productData)),
      false,
    );
    return response['deleteFromProductStore'];
  } catch (error) {
    return graphqlExceptionHandler(error);
  }
};
