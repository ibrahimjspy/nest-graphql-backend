import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const b2bQuery = (productId: string): string => {
  return gql`
    query {
      marketplaceShop(filter: { productId: "${productId}" }) {
        id
        name
      }
    }
  `;
};

const b2cQuery = (productId: string): string => {
  return gql`
    query {
      marketplaceShop(filter: { productId: "${productId}" }) {
        id
        name
      }
    }
  `;
};

export const shopIdByProductQuery = (productId: string, isB2C = '') => {
  return graphqlQueryCheck(b2bQuery(productId), b2cQuery(productId), isB2C);
};
