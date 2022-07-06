import { request } from 'graphql-request';
import { mockProductCard } from '../../queries/mock';
// import { productCardQuery } from '../queries/productCard';

// Product card GraphQL handlers

export const productCardHandler = async () => {
  const GRAPHQL_ENDPOINT: string = process.env.MOCK_GRAPHQL_ENDPOINT;
  let productCardsData = {};
  await request(GRAPHQL_ENDPOINT, mockProductCard()).then((data) => {
    shuffleArray(data.products);
    productCardsData = data;
  });
  return productCardsData;
};
/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
