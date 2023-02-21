import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const b2bQuery = (shopUrl: string): string => {
  return gql`
  query {
    marketplaceShop(filter: {
      url: "${shopUrl}"
    }) {
        id
        name
        about
        description
        madeIn
        minOrder
        url
        products {
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

const b2cQuery = (shopUrl: string): string => {
  return gql`
  query {
    marketplaceShop(filter: {
      url: "${shopUrl}"
    }) {
        id
        name
        about
        description
        madeIn
        minOrder
        url
        products {
          id
        }
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

export const shopDetailByUrlQuery = (shopUrl: string, isb2c = false) => {
  return graphqlQueryCheck(b2bQuery(shopUrl), b2cQuery(shopUrl), isb2c);
};
