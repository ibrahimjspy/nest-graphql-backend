import {
  graphqlCall,
  graphqlExceptionHandler,
  graphqlResultErrorHandler,
} from 'src/core/proxies/graphqlHandler';
import { carouselQuery } from 'src/graphql/queries/shop/carousel';
import { shopDetailsQuery } from 'src/graphql/queries/shop/shopDetails';
import { shopIdByVariantIdQuery } from '../queries/shop/shopIdByVariants';
import { shopIdByOrderIdQuery } from '../queries/shop/shopIdByOrderId';
import { ShopByEmailQuery } from '../queries/shop/shopbyEmail';
import { shopBankDetailsQuery } from '../queries/shop/shopBankDetailsQuery';
import { shopBankDetailsMutation } from '../mutations/shop/shopBankDetails';
import { ShopType } from '../types/shop.type';
import { createStoreDTO } from 'src/modules/shop/dto/shop';
import { createStoreMutation } from '../mutations/shop/createShop';
import { addStoreToShopMutation } from '../mutations/shop/addStoreToShop';
import { deactivateStoreMutation } from '../mutations/shop/deactivateStore';
import {
  getMyVendorsFieldValues,
  getStoreFrontFieldValues,
} from 'src/modules/shop/Shop.utils';
import { updateMyVendorsMutation } from '../mutations/shop/updateMyVendors';
import { vendorDetailsQuery } from '../queries/shop/vendorDetails';
import { shopIdByProductQuery } from '../queries/shop/shopIdByProductId';
import { getAllShopsQuery } from '../queries/shop/getAllShops';
import { shopDetailByUrlQuery } from '../queries/shop/shopDetailByUrl';

export const carouselHandler = async (token: string): Promise<object> => {
  try {
    return await graphqlCall(carouselQuery(), token);
  } catch (error) {
    return graphqlExceptionHandler(error);
  }
};

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
  shopId: string,
  storeId: string,
  shopDetail: object,
  token: string,
): Promise<object> => {
  try {
    // concat previous storeIds and new storeId for shop
    const shopStoreIds = [
      storeId,
      ...getStoreFrontFieldValues(shopDetail['fields']),
    ];
    const response = await graphqlResultErrorHandler(
      await graphqlCall(
        addStoreToShopMutation(shopId, [...new Set(shopStoreIds)]),
        token,
      ),
    );
    return response['updateMarketplaceShop'];
  } catch (error) {
    // If store adding in shop fails then we need to deactivate that store
    await graphqlResultErrorHandler(
      await graphqlCall(deactivateStoreMutation(storeId), token, true),
    );
    const errorMessage = await graphqlExceptionHandler(error);
    return {
      message: errorMessage.message,
    };
  }
};

export const shopDetailsHandler = async (
  shopId: string,
  isb2c = false,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(shopDetailsQuery(shopId, isb2c), '', isb2c),
  );
  return response['marketplaceShop'];
};

export const shopDetailByUrlHandler = async (
  shopUrl: string,
  isb2c = false,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(shopDetailByUrlQuery(shopUrl, isb2c), '', isb2c),
  );
  return response['marketplaceShop'];
};

export const shopIdByVariantIdHandler = async (
  variantId: string,
): Promise<object> => {
  try {
    const response = await graphqlResultErrorHandler(
      await graphqlCall(shopIdByVariantIdQuery(variantId)),
    );
    return response['marketplaceShop'];
  } catch (error) {
    const errorMessage = await graphqlExceptionHandler(error);
    return {
      message: errorMessage.message,
      variantId: variantId,
    };
  }
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

export const GetShopDetailsbyEmailHandler = async (
  Email: string,
): Promise<object> => {
  try {
    const response = await graphqlResultErrorHandler(
      await graphqlCall(ShopByEmailQuery(Email)),
    );
    return response['marketplaceShops'];
  } catch (error) {
    const errorMessage = await graphqlExceptionHandler(error);
    return errorMessage;
  }
};

export const getShopBankDetailsHandler = async (
  shopId: string,
  token: string,
): Promise<object> => {
  try {
    const response = await graphqlResultErrorHandler(
      await graphqlCall(shopBankDetailsQuery(shopId), token),
    );
    return response['shopBankDetails'];
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

export const getStoreFrontIdHandler = async (
  retailerId: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(shopDetailsQuery(retailerId)),
  );
  return response['marketplaceShop'];
};

export const getStoreProductVariantsHandler = async (
  retailerId: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(shopDetailsQuery(retailerId, true), '', true),
  );
  return response['marketplaceShop'];
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

export const vendorDetailsHandler = async (
  vendorId: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(vendorDetailsQuery(vendorId)),
  );
  return response['marketplaceShop'];
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
