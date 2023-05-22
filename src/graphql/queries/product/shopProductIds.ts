import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { pageInfoFragment } from 'src/graphql/fragments/pageInfo';
import { validatePageFilter } from 'src/graphql/utils/pagination';
import { ProductFilterDto } from 'src/modules/product/dto/product.dto';

const b2cQuery = (filter: ProductFilterDto): string => {
  const { storeId, category } = filter;
  const pagination = validatePageFilter(filter);
  const shopFilter = category ? `filter: {categoryId: "${category}"}` : '';
  return gql`
  query {
    getProductsByShop(
      ${pagination}
      shopId: "${storeId}",
      ${shopFilter}
    ) {
      ... on ProductsShopType {
        totalCount
        pageInfo {
         ... PageInfo
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
  }
  ${pageInfoFragment}
  `;
};

const b2bQuery = b2cQuery;

export const shopProductIdsByCategoryIdQuery = (filter, isb2c = false) => {
  return graphqlQueryCheck(b2bQuery(filter), b2cQuery(filter), isb2c);
};
