import { request } from 'graphql-request';
import { carouselQuery } from '../../queries/shop/carousel';

// carousel graph ql handler

export const carouselHandler = async () => {
  const GRAPHQL_ENDPOINT: string = process.env.MOCK_GRAPHQL_ENDPOINT || TEST;
  let carouselData = {};
  await request(GRAPHQL_ENDPOINT, carouselQuery())
    .then((data) => {
      carouselData = data;
    })
    .catch(() => console.log('graphql error'));
  return carouselData;
};
// Endpoint for unit testing locally <JEST|ARTILLERY>
const TEST = 'http://localhost:4000/';
