import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { validatePageFilter } from 'src/graphql/utils/pagination';

const b2cQuery = ({ shopId, category, ...pagination }): string => {
  return gql`
  query {
    getProductsByShop(
      ${validatePageFilter(pagination)}
      shopId: "${shopId}",
      filter: {
        categoryId: "${category}"
      }
    ) {
      ... on ProductsShopType {
        pageInfo {
          hasPreviousPage
          hasNextPage
          startCursor
          endCursor
        }
        edges {
          cursor
          node {
            productId
          }
        }
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
