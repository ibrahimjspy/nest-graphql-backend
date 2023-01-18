import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { PaginationDto } from 'src/graphql/dto/pagination.dto';
import { validatePageFilter } from 'src/graphql/utils/pagination';

const b2bQuery = (productIds, pagination: PaginationDto): string => {
  return gql`
    query {
      products(${validatePageFilter(
        pagination,
      )}, channel: "default-channel", filter: { ids: ${JSON.stringify(
    productIds,
  )} }) {
        totalCount
        pageInfo {
          hasNextPage
          endCursor
          startCursor
          hasPreviousPage
        }
        edges {
          node {
            name
            id
            category {
              id
              name
              ancestors(first: 5) {
                edges {
                  node {
                    id
                    name
                  }
                }
              }
            }
            description
            slug
            id
            media {
              url
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
              pricing {
                price {
                  gross {
                    amount
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
};

const b2cQuery = (productIds, pagination: PaginationDto): string => {
  return gql`
    query {
      products(${validatePageFilter(
        pagination,
      )}, channel: "default-channel", filter: { ids: ${JSON.stringify(
    productIds,
  )} }) {
        totalCount
        pageInfo {
          hasNextPage
          endCursor
          startCursor
          hasPreviousPage
        }
        edges {
          node {
            name
            id
            category {
              id
              name
              ancestors(first: 5) {
                edges {
                  node {
                    id
                    name
                  }
                }
              }
            }
            description
            slug
            id
            media {
              url
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
              pricing {
                price {
                  gross {
                    amount
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
};

export const getMyProductsQuery = (
  variantsIds: string[],
  pagination: PaginationDto,
  isB2C = '',
) => {
  return graphqlQueryCheck(
    b2bQuery(variantsIds, pagination),
    b2cQuery(variantsIds, pagination),
    isB2C,
  );
};
