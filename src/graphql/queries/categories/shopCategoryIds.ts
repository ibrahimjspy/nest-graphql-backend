import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const b2bQuery = (shopId: string): string => {
  return gql`
  query {
    getCategoriesByShop(shopId: "${shopId}") {
      ... on CategoryShopType {
        categoryIds
      }
      ... on ResultError {
        __typename
        errors
        message
      }
    }
  }`;
};

const b2cQuery = b2bQuery;

export const shopCategoryIdsQuery = (shopId: string, isb2c = false) => {
  return graphqlQueryCheck(b2bQuery(shopId), b2cQuery(shopId), isb2c);
};
