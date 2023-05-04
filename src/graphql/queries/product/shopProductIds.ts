import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { validatePageFilter } from 'src/graphql/utils/pagination';
import { ProductFilterDto } from 'src/modules/product/dto/product.dto';

const b2cQuery = (filter: ProductFilterDto): string => {
  const { storeId, category } = filter;
  const pagination = validatePageFilter(filter);
  return gql`
  query {
    getProductsByShop(
      ${pagination}
      shopId: "${storeId}",
      filter: {
        ${category ? `categoryId: "${category}"` : ''}
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
