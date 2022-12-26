import {
  graphqlCall,
  graphqlExceptionHandler,
  graphqlResultErrorHandler,
} from 'src/core/proxies/graphqlHandler';
import { carouselQuery } from 'src/graphql/queries/shop/carousel';
import { shopDetailsQuery } from 'src/graphql/queries/shop/shopDetails';
import { shopIdByVariantIdQuery } from '../queries/shop/shopIdByVariants';
import { shopIdByOrderIdQuery } from '../queries/shop/shopIdByOrderId';

export const carouselHandler = async (token: string): Promise<object> => {
  try {
    return await graphqlCall(carouselQuery(), token);
  } catch (error) {
    return graphqlExceptionHandler(error);
  }
};

export const shopDetailsHandler = async (shopId: string): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(shopDetailsQuery(shopId)),
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
