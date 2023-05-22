import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const b2bQuery = (quantity: number): string => {
  return gql`
    query {
      marketplaceShops(filter: { first: ${quantity} }) {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  `;
};

const b2cQuery = b2bQuery;

export const getAllShopsQuery = (quantity: number, isB2C = false) => {
  return graphqlQueryCheck(b2bQuery(quantity), b2cQuery(quantity), isB2C);
};
