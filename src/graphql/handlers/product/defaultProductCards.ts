import { request } from 'graphql-request';
import { productCardsDefaultQuery } from '../../queries/product/defaultProductCards';
import { graphqlEndpoint } from '../../../public/graphqlEndpointToggle';

export const productCardHandler = async () => {
  let productCardsData = {};
  await request(graphqlEndpoint(), productCardsDefaultQuery())
    .then((data) => {
      process.env.MOCK == 'true' ? shuffleArray(data.products) : '';
      productCardsData = data;
    })
    .catch(() => console.log('graphql error'));
  return productCardsData;
};
// right now we are using shuffle to mimic mock data according to collection id
/* Randomize array in-place using shuffle algorithm */
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
