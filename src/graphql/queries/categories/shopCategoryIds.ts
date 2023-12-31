import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { resultErrorFragment } from 'src/graphql/fragments/errors';

const b2cQuery = (shopId: string): string => {
  return gql`
  query {
    getCategoriesByShop(shopId: "${shopId}") {
      ... on CategoryShopType {
        categoryIds
      }
      ... on ResultError {
        __typename
        ... ResultError
      }
    }
  }
  ${resultErrorFragment}
  `;
};

const b2bQuery = b2cQuery;

export const shopCategoryIdsQuery = (shopId: string, isb2c = false) => {
  return graphqlQueryCheck(b2bQuery(shopId), b2cQuery(shopId), isb2c);
};
