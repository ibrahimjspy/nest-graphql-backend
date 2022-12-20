import {
  graphqlCall,
  graphqlExceptionHandler,
  graphqlResultErrorHandler,
} from 'src/core/proxies/graphqlHandler';
import { carouselQuery } from 'src/graphql/queries/shop/carousel';
import { shopDetailsQuery } from 'src/graphql/queries/shop/shopDetails';
import { shopIdByVariantIdQuery } from '../queries/shop/shopIdByVariants';

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
  const response = await graphqlResultErrorHandler(
    await graphqlCall(shopIdByVariantIdQuery(variantId)),
  );
  return response['marketplaceShop'];
};
