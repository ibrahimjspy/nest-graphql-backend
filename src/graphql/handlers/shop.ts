import {
  graphqlCall,
  graphqlExceptionHandler,
} from 'src/public/graphqlHandler';
import { carouselQuery } from 'src/graphql/queries/shop/carousel';

export const carouselHandler = async (): Promise<object> => {
  try {
    return await graphqlCall(carouselQuery());
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};
