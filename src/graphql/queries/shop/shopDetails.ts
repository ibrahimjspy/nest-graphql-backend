import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const b2bQuery = (shopId: string): string => {
  return gql`
  query {
    marketplaceShop(filter: {
      id: "${shopId}"
    }) {
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

export const shopDetailsQuery = (shopId: string, isb2c = false) => {
  return graphqlQueryCheck(b2bQuery(shopId), b2cQuery(shopId), isb2c);
};
