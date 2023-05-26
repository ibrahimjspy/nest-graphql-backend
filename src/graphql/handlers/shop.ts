import {
  graphqlCall,
  graphqlExceptionHandler,
  graphqlResultErrorHandler,
} from 'src/core/proxies/graphqlHandler';
import { shopIdByOrderIdQuery } from '../queries/shop/shopIdByOrderId';
import { shopBankDetailsQuery } from '../queries/shop/shopBankDetailsQuery';
import { shopBankDetailsMutation } from '../mutations/shop/shopBankDetails';
import { ShopType } from '../types/shop.type';
import { createStoreDTO, shopDetailDto } from 'src/modules/shop/dto/shop';
import { createStoreMutation } from '../mutations/shop/createShop';
import { addStoreToShopMutation } from '../mutations/shop/addStoreToShop';
import { deactivateStoreMutation } from '../mutations/shop/deactivateStore';
import {
  getFieldValues,
  getMyVendorsFieldValues,
} from 'src/modules/shop/Shop.utils';
import { updateMyVendorsMutation } from '../mutations/shop/updateMyVendors';
import { shopIdByProductQuery } from '../queries/shop/shopIdByProductId';
import { getAllShopsQuery } from '../queries/shop/getAllShops';
import { shopDetailsV2Query } from '../queries/shop/shopDetailsV2';
import { removeProductsFromShopMutation } from '../mutations/shop/removeProducts';
import { shopInfoDto } from 'src/modules/orders/dto';
import { updateStoreInfoMutation } from '../mutations/shop/updateStore';
import { ShopBankDetailsType } from 'src/modules/shop/services/shop/Shop.service.types';

export const createStoreHandler = async (
  storeInput: createStoreDTO,
  token: string,
  isb2c = false,
): Promise<ShopType> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(createStoreMutation(storeInput, isb2c), token, isb2c),
  );
  return response['createMarketplaceShop'];
};

export const addStoreToShopHandler = async (
  storeDetails: object,
  shopDetail: object,
  token: string,
): Promise<object> => {
  try {
    // concat previous storeIds and new storeId for shop
    const shopStoreIds = [
      storeDetails['id'],
      ...getFieldValues(shopDetail['fields'], 'storefrontids'),
    ];
    const shopStoreUrls = [
      storeDetails['url'],
      ...getFieldValues(shopDetail['fields'], 'storefronturls'),
    ];
    const response = await graphqlResultErrorHandler(
      await graphqlCall(
        addStoreToShopMutation(
          shopDetail['id'],
          [...new Set(shopStoreIds)],
          [...new Set(shopStoreUrls)],
        ),
        token,
      ),
    );
    return response['updateMarketplaceShop'];
  } catch (error) {
    // If store adding in shop fails then we need to deactivate that store
    await graphqlResultErrorHandler(
      await graphqlCall(
        deactivateStoreMutation(storeDetails['id']),
        token,
        true,
      ),
    );
    const errorMessage = await graphqlExceptionHandler(error);
    return {
      message: errorMessage.message,
    };
  }
};

export const getShopDetailsV2Handler = async (
  filter: shopDetailDto,
  isb2c = false,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(shopDetailsV2Query(filter, isb2c), '', isb2c),
  );
  return response['marketplaceShop'];
};

export const shopIdByOrderIdHandler = async (
  orderId: string,
): Promise<object> => {
  try {
    const response = await graphqlResultErrorHandler(
      await graphqlCall(shopIdByOrderIdQuery(orderId)),
    );
    return response['marketplaceOrders'];
  } catch (error) {
    const errorMessage = await graphqlExceptionHandler(error);
    return {
      message: errorMessage.message,
      orderId: orderId,
    };
  }
};

export const getShopBankDetailsHandler = async (
  shopId: string,
  token: string,
): Promise<ShopBankDetailsType> => {
  try {
    const response = await graphqlResultErrorHandler(
      await graphqlCall(shopBankDetailsQuery(shopId), token),
    );
    return response['shopBankDetails'] as ShopBankDetailsType;
  } catch (error) {
    const errorMessage = await graphqlExceptionHandler(error);
    return errorMessage;
  }
};

export const saveShopBankDetailsHandler = async (
  shopId: string,
  accountId: string,
  token: string,
): Promise<object> => {
  try {
    const response = await graphqlResultErrorHandler(
      await graphqlCall(shopBankDetailsMutation(shopId, accountId), token),
    );
    return response['createShopAccountDetails'];
  } catch (error) {
    const errorMessage = await graphqlExceptionHandler(error);
    return errorMessage;
  }
};

export const addVendorsToShopHandler = async (
  shopId: string,
  vendorIds: number[],
  shopDetail: object,
  token: string,
): Promise<object> => {
  try {
    // concat previous and new vendorIds for shop
    const shopVendorIds = [
      ...getMyVendorsFieldValues(shopDetail['fields']),
      ...vendorIds,
    ];
    const response = await graphqlResultErrorHandler(
      await graphqlCall(
        updateMyVendorsMutation(shopId, [
          ...new Set(shopVendorIds.map(String)),
        ]),
        token,
      ),
    );
    return response['updateMarketplaceShop'];
  } catch (error) {
    const errorMessage = await graphqlExceptionHandler(error);
    return errorMessage;
  }
};

export const removeMyVendorsHandler = async (
  shopId: string,
  vendorIds: number[],
  shopDetail: object,
  token: string,
): Promise<object> => {
  try {
    const allVendorIds = [...getMyVendorsFieldValues(shopDetail['fields'])];
    // delete vendorIds from shop previous vendorIds for shop
    const filteredVendorIds = allVendorIds.filter(
      (vendorId) => !vendorIds.includes(Number(vendorId)),
    );
    const response = await graphqlResultErrorHandler(
      await graphqlCall(
        updateMyVendorsMutation(shopId, [...new Set(filteredVendorIds)]),
        token,
      ),
    );
    return response['updateMarketplaceShop'];
  } catch (error) {
    const errorMessage = await graphqlExceptionHandler(error);
    return errorMessage;
  }
};

export const shopIdByProductIdHandler = async (
  productId: string,
): Promise<object> => {
  try {
    const response = await graphqlResultErrorHandler(
      await graphqlCall(shopIdByProductQuery(productId)),
    );
    return response['marketplaceShop'];
  } catch (error) {
    const errorMessage = await graphqlExceptionHandler(error);
    return {
      message: errorMessage.message,
      productId: productId,
    };
  }
};

export const getAllShopsHandler = async (
  quantity: number,
  isb2c = false,
): Promise<object> => {
  try {
    const response = await graphqlResultErrorHandler(
      await graphqlCall(getAllShopsQuery(quantity, isb2c)),
    );
    return response['marketplaceShops'];
  } catch (error) {
    const errorMessage = await graphqlExceptionHandler(error);
    return {
      message: errorMessage.message,
    };
  }
};

export const removeProductsFromShopHandler = async (
  productIds: string[],
  shop: string,
  token: string,
  isb2c = false,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      removeProductsFromShopMutation(productIds, shop),
      token,
      isb2c,
    ),
  );
  return response['deleteProductsFromShop'];
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
