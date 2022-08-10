import { graphqlCall } from 'src/public/graphqlHandler';
import { carouselQuery } from 'src/graphql/queries/shop/carousel';

export const carouselHandler = async (): Promise<object> => {
  return await graphqlCall(carouselQuery());
};
