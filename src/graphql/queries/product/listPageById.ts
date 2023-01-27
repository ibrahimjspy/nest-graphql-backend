import { gql } from 'graphql-request';
import { DEFAULT_CHANNEL } from 'src/constants';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { PaginationDto } from 'src/graphql/dto/pagination.dto';
import { validatePageFilter } from 'src/graphql/utils/pagination';

const federationQuery = (id, pagination: PaginationDto): string => {
  return gql`
    query {
      products(
        ${validatePageFilter(pagination)}
        channel: "${DEFAULT_CHANNEL}"
        filter: { categories: ["${id}"] }
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

const mockQuery = () => {
  return gql`
    query {
      category(slug: "accessories") {
        products(first: 20, channel: "${DEFAULT_CHANNEL}") {
          edges {
            node {
              name
              id
              slug
            }
          }
        }
        name
        id
        slug
        children(first: 10) {
          edges {
            node {
              name
              id
              slug
            }
          }
        }
      }
    }
  `;
};

export const productListPageQuery = (id: string, pagination) => {
  return graphqlQueryCheck(federationQuery(id, pagination), mockQuery());
};
