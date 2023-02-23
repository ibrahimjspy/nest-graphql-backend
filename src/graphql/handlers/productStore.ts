import {
  graphqlCall,
  graphqlExceptionHandler,
  graphqlResultErrorHandler,
} from 'src/core/proxies/graphqlHandler';
import { deleteFromProductStoreMutation } from '../mutations/productStore/deleteProducts';
import { addToProductStoreMutation } from '../mutations/productStore/addProducts';
import { updateStoreInfoMutation } from '../mutations/productStore/storeInfo';
import { getStoredProductsQuery } from '../queries/productStore/products';
import { getStoreInfoQuery } from '../queries/productStore/storeInfo';
import {
  PushToStoreDto,
  addToProductStoreDTO,
  deleteFromProductStoreDTO,
  getStoredProductsDTO,
} from 'src/modules/productStore/dto/products';
import { shopInfoDto } from 'src/modules/orders/dto';
import { pushToStoreMutation } from '../mutations/productStore/pushtToStore';

export const getStoredProductsHandler = async (
  shopId: string,
  productFilter: getStoredProductsDTO,
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

export const getStoreInfoHandler = async (
  shopId: string,
  token: string,
  isB2c = false,
): Promise<object> => {
  try {
    const response = await graphqlResultErrorHandler(
      await graphqlCall(getStoreInfoQuery(shopId), token, isB2c),
    );
    return response['marketplaceShop'];
  } catch (error) {
    return graphqlExceptionHandler(error);
  }
};

export const updateStoreInfoHandler = async (
  shopId: string,
  storeDetails: shopInfoDto,
  token: string,
  isB2c = false,
): Promise<object> => {
  try {
    const response = await graphqlResultErrorHandler(
      await graphqlCall(
        updateStoreInfoMutation(shopId, storeDetails),
        token,
        isB2c,
      ),
    );
    return response['updateMarketplaceShop'];
  } catch (error) {
    return graphqlExceptionHandler(error);
  }
};

export const pushToStoreHandler = async (
  pushToStoreInput: PushToStoreDto,
  token: string,
): Promise<object> => {
  try {
    const response = await graphqlResultErrorHandler(
      await graphqlCall(pushToStoreMutation(pushToStoreInput), token),
    );
    return response['createProducts'];
  } catch (error) {
    return graphqlExceptionHandler(error);
  }
};
