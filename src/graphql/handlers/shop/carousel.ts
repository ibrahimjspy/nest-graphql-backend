import { request } from 'graphql-request';
import { carouselQuery } from 'src/graphql/queries/shop/carousel';
import { graphqlEndpoint } from 'src/public/graphqlEndpointToggle';

export const carouselHandler = async (): Promise<object> => {
  let carouselData = {};
  await request(graphqlEndpoint(), carouselQuery())
    .then((data) => {
      carouselData = data;
    })
    .catch(() => console.log('graphql error'));
  return carouselData;
};
