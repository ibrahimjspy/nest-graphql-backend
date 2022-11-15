import {
  graphqlCall,
  graphqlExceptionHandler,
} from 'src/core/proxies/graphqlHandler';
import { carouselQuery } from 'src/graphql/queries/shop/carousel';

export const carouselHandler = async (): Promise<object> => {
  try {
    return await graphqlCall(carouselQuery());
  } catch (error) {
    return graphqlExceptionHandler(error);
  }
};
