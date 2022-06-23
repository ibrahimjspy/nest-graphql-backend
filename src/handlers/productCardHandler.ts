import { request } from 'graphql-request';
import { isEmpty } from 'rxjs';
import { mockProductCard } from 'src/queries/mock';
// import { productCardQuery } from '../queries/productCard';

// Product card GraphQL handlers

export const productCardHandler = async () => {
  let productCardsData = {};
  await request(
    'https://faker.graphqleditor.com/ibrahim/mockcardapi/graphql',
    mockProductCard(),
  ).then((data) => {
    const Data = dummyDataGenerator(data);
    productCardsData = Data;
  });
  return productCardsData;
};

// Data filtering of Mock Api

const dummyDataGenerator = (data: JSON) => {
  const productCardsDataMock = { products: [] };
  for (let i = 0; i < 10; i++) {
    productCardsDataMock.products.push(data);
  }
  productCardsDataMock.products.map((item) => {
    item.title = 'Product title';
    item.image = 'https://iili.io/httHog.png';
    item.color_variant = ['red', 'blue', 'green', 'orange', 'black'];
  });
  return productCardsDataMock;
};
