import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const b2cQuery = (shopId: string, categoryId: string): string => {
  return gql`
  query {
    getProductsByShop(shopId: "${shopId}", filter: {
      categoryId: "${categoryId}"
    }) {
      ... on ProductsShopType {
        productIds
      }
      ... on ResultError {
        errors
        message
      }
    }
  }`;
};

const b2bQuery = b2cQuery;

export const shopProductIdsByCategoryIdQuery = (shopId: string, categoryId: string, isb2c = false) => {
  return graphqlQueryCheck(b2bQuery(shopId, categoryId), b2cQuery(shopId, categoryId), isb2c);
};
