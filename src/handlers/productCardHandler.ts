import { request } from 'graphql-request';
import { productCardQuery } from '../queries/productCard';

export const productCardHandler = async () => {
  let productCardsData = {};
  await request('GraphQlServer', productCardQuery()).then(
    (data) => (productCardsData = data),
  );
  return productCardsData;
};
