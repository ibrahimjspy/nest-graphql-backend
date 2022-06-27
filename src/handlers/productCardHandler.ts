import { request } from 'graphql-request';
import { mockProductCard } from '../queries/mock';
// import { productCardQuery } from '../queries/productCard';

// Product card GraphQL handlers

export const productCardHandler = async () => {
  let productCardsData = {};
  await request('http://localhost:4000/', mockProductCard()).then((data) => {
    productCardsData = data;
  });
  return productCardsData;
};
