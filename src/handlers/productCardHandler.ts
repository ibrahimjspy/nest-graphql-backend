import { request } from 'graphql-request';
import { mockProductCard } from 'src/queries/mock';
// import { productCardQuery } from '../queries/productCard';

// Product card GraphQL handlers

export const productCardHandler = async () => {
  let productCardsData = {};
  await request(
    'https://faker.graphqleditor.com/ibrahim/mockcardapi/graphql',
    mockProductCard(),
  ).then((data) => {
    // demo data filtering for mock api
    data.color_variant = ['red', 'blue', 'green', 'orange', 'black'];
    data.image = 'https://iili.io/httHog.png';
    data.title = 'Product title';
    const Data = dummyDataGenerator(data);
    productCardsData = Data;
  });
  return productCardsData;
};

// Mock query handler for testing

const dummyDataGenerator = (data: JSON) => {
  const productCardsDataMock = { products: [] };
  for (let i = 0; i < 10; i++) {
    productCardsDataMock.products.push(data);
  }
  return productCardsDataMock;
};
