import { gql } from 'graphql-request';
import { DEFAULT_CHANNEL, DEFAULT_THUMBNAIL_SIZE } from 'src/constants';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { validatePageFilter } from 'src/graphql/utils/pagination';

const b2bQuery = ({ categoryId, productIds, ...pagination }): string => {
  return gql`
    query {
      products(
        ${validatePageFilter(pagination)}
        channel: "${DEFAULT_CHANNEL}"
        filter: {
          categories: ["${categoryId}"],
          isAvailable: true,
          ids: ${JSON.stringify(productIds)}
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
            category {
              id
              name
            }
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
            thumbnail(size: ${DEFAULT_THUMBNAIL_SIZE}) {
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
