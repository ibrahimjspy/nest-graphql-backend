import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const federationQuery = (shopId: string): string => {
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
    }
  }`;
};

export const shopDetailsQuery = (shopId: string) => {
  return graphqlQueryCheck(federationQuery(shopId), federationQuery(shopId));
};
