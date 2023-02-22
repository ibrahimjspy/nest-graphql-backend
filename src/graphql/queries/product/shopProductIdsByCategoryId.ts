import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const b2cQuery = (filter): string => {
  return gql`
  query {
    getProductsByShop(shopId: "${filter.shopId}", filter: {
      categoryId: "${filter.categoryId}"
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

export const shopProductIdsByCategoryIdQuery = (filter, isb2c = false) => {
  return graphqlQueryCheck(b2bQuery(filter), b2cQuery(filter), isb2c);
};
