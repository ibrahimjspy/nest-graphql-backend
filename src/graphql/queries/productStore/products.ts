import { gql } from 'graphql-request';
import { validatePageFilter } from 'src/graphql/utils/pagination';
import { getStoredProductsDTO } from 'src/modules/productStore/dto/products';

export const getStoredProductsQuery = (
  shopId: string,
  filter: getStoredProductsDTO,
) => {
  const productIds = JSON.stringify(filter.productIds) || '[]';
  const pageFilter = validatePageFilter(filter);
  return gql`
      query {
        storedProducts(
            Filter: {
              shopId: "${shopId}"
              productIds:${productIds}
            }
            Paginate: {
              ${pageFilter}
            }
        ) {
            __typename
            ... on StoredProductConnectionType {
              pageInfo{
                startCursor
                endCursor
                hasNextPage
                hasPreviousPage
              }
                edges {
                  node {
                    productVariantIds
                    product {
                      id
                    }
                    shop {
                      id
                    }
                  }
                }
              }
        }}
  `;
};
