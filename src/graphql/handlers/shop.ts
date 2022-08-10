import { graphqlCall } from 'src/public/graphqlHandler';
import { carouselQuery } from 'src/graphql/queries/shop/carousel';

export const carouselHandler = (): Promise<object> => {
  return graphqlCall(carouselQuery());
};
