import { gql } from 'graphql-request';
import { DEFAULT_CHANNEL } from 'src/constants';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import {
  removeKeysQuoutes,
  validateCategoryFilter,
} from 'src/core/utils/helpers';
import { validatePageFilter } from 'src/graphql/utils/pagination';
import { ProductFilterDto } from 'src/modules/product/dto';

export const federationQuery = (filter: ProductFilterDto): string => {
  const pageFilter = validatePageFilter(filter);
  const categoryFilter = validateCategoryFilter(filter['category']);
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
          ids: ${removeKeysQuoutes(filter['ids'] || [])}
          isPublished: true,
          hasCategory: true,
          stockAvailability: IN_STOCK,
          ${categoryFilter}
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
