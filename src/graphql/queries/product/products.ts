import { gql } from 'graphql-request';
import { DEFAULT_THUMBNAIL_SIZE } from 'src/constants';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { validatePageFilter } from 'src/graphql/utils/pagination';
import { ProductFilterDto } from 'src/modules/product/dto';

export const b2bQuery = (filter: ProductFilterDto): string => {
  const pageFilter = validatePageFilter(filter);
  const categoryFilter = filter['category'] ? `"${filter['category']}"` : '';
  return gql`
    query {
      products(
        ${pageFilter}
        filter: {
          ids: ${JSON.stringify(filter.productIds || [])}
          isAvailable: true,
          categories: [${categoryFilter}]
        }
      ) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          endCursor
          startCursor
        }
        totalCount
        edges {
          node {
            id
            slug
            defaultVariant {
              id
              pricing {
                price {
                  gross {
                    currency
                    amount
                  }
                }
              }
            }
            variants {
              id
              attributes {
                attribute {
                  name
                }
                values {
                  name
                }
              }
            }
            thumbnail(size: ${DEFAULT_THUMBNAIL_SIZE}) {
              url
            }
            name
            description
          }
        }
      }
    }
  `;
};

export const b2cQuery = (filter: ProductFilterDto): string => {
  const pageFilter = validatePageFilter(filter);
  const categoryFilter = filter['category'] ? `"${filter['category']}"` : '';
  return gql`
    query {
      products(
        ${pageFilter}
        filter: {
          ids: ${JSON.stringify(filter.productIds || [])}
          isAvailable: true,
          categories: [${categoryFilter}]
        }
      ) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          endCursor
          startCursor
        }
        totalCount
        edges {
          node {
            id
            slug
            category {
              name
            }
            defaultVariant {
              id
              pricing {
                price {
                  gross {
                    currency
                    amount
                  }
                }
              }
            }
            variants {
              id
              attributes {
                attribute {
                  name
                }
                values {
                  name
                }
              }
            }
            thumbnail(size: ${DEFAULT_THUMBNAIL_SIZE}) {
              url
            }
            name
            description
          }
        }
      }
    }
  `;
};
export const productsQuery = (filter: ProductFilterDto) => {
  return graphqlQueryCheck(b2bQuery(filter), b2cQuery(filter));
};
