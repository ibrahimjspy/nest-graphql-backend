import { gql } from 'graphql-request';
import { DEFAULT_CHANNEL } from 'src/constants';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { validatePageFilter } from 'src/graphql/utils/pagination';

const b2bQuery = (filter): string => {
  return gql`
    query {
      products(
        ${validatePageFilter(filter.pagination)}
        channel: "${DEFAULT_CHANNEL}"
        filter: {
          categories: ["${filter.categoryId}"],
          ids: ${JSON.stringify(filter.productIds)}
        }
      ) {
        totalCount
        pageInfo{
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
        edges {
          node {
            id
            slug
            defaultVariant {
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

const b2cQuery = b2bQuery;

export const productListPageQuery = (filter, isb2c = false) => {
  return graphqlQueryCheck(b2bQuery(filter), b2cQuery(filter), isb2c);
};
