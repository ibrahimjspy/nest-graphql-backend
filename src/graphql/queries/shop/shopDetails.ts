import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const b2bQuery = (shopId: string): string => {
  return gql`
  query {
    marketplaceShop(filter: {
      id: "${shopId}"
    }) {
      __typename
        id
        name
        about
        description
        madeIn
        minOrder
        url
        returnPolicy
        storePolicy
        fields {
          name
          values
        }
    }
  }`;
};

const b2cQuery = (shopId: string): string => {
  return gql`
  query {
    marketplaceShop(filter: {
      id: "${shopId}"
    }) {
      __typename
        id
        name
        about
        description
        madeIn
        minOrder
        url
        productVariants {
          id
        }
        returnPolicy
        storePolicy
        fields {
          name
          values
        }
    }
  }`;
};

export const shopDetailsQuery = (shopId: string, isB2C = '') => {
  return graphqlQueryCheck(b2bQuery(shopId), b2cQuery(shopId), isB2C);
};
