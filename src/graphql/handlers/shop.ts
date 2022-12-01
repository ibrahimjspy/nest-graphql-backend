import {
  graphqlCall,
  graphqlExceptionHandler,
} from 'src/core/proxies/graphqlHandler';
import { carouselQuery } from 'src/graphql/queries/shop/carousel';

export const carouselHandler = async (header: string): Promise<object> => {
  try {
    return await graphqlCall(carouselQuery(), header);
  } catch (error) {
    return graphqlExceptionHandler(error);
  }
};
