import { gql } from 'graphql-request';
import { DEFAULT_CHANNEL } from 'src/constants';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { validatePageFilter } from 'src/graphql/utils/pagination';
import { ProductFilterDto } from 'src/modules/product/dto';

export const federationQuery = (filter: ProductFilterDto): string => {
  const pageFilter = validatePageFilter(filter);
  const categoryFilter = filter['category'] ? `"${filter['category']}"` : '';
  return gql`
    query {
      products(
        ${pageFilter}
        channel: "${DEFAULT_CHANNEL}"
        sortBy: {
          direction: DESC
          field: PUBLISHED_AT
        }
        filter: {
          ids: ${JSON.stringify(filter.productIds || [])}
          isPublished: true,
          isAvailable: true,
          hasCategory: true,
          stockAvailability: IN_STOCK,
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
              sku
              attributes {
                attribute {
                  name
                }
                values {
                  name
                }
              }
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
            thumbnail {
              url
            }
            media {
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
  const query = federationQuery(filter);
  return graphqlQueryCheck(query, query);
};
