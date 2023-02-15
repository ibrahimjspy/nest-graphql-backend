import { gql } from 'graphql-request';
import { DEFAULT_CHANNEL } from 'src/constants';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { PaginationDto } from 'src/graphql/dto/pagination.dto';
import { validatePageFilter } from 'src/graphql/utils/pagination';

const b2bQuery = (id, productIds: string[], pagination: PaginationDto): string => {
  return gql`
    query {
      products(
        ${validatePageFilter(pagination)}
        channel: "${DEFAULT_CHANNEL}"
        filter: {
          categories: ["${id}"],
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

export const productListPageQuery = (id: string, productIds:string[], pagination, isb2c = false) => {
  return graphqlQueryCheck(b2bQuery(id, productIds, pagination), b2cQuery(id, productIds, pagination), isb2c);
};
