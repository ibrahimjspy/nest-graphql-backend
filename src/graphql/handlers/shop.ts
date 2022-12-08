import {
  graphqlCall,
  graphqlExceptionHandler,
} from 'src/core/proxies/graphqlHandler';
import { carouselQuery } from 'src/graphql/queries/shop/carousel';

export const carouselHandler = async (token: string): Promise<object> => {
  try {
    return await graphqlCall(carouselQuery(), token);
  } catch (error) {
    return graphqlExceptionHandler(error);
  }
};
