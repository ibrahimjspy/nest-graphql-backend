import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { validatePageFilter } from 'src/graphql/utils/pagination';
import { myProductsDTO } from 'src/modules/shop/dto/myProducts';

const b2bQuery = (productIds, filter: myProductsDTO): string => {
  return gql`
    query {
      products(${validatePageFilter(
        filter,
      )}, channel: "default-channel", filter: { ids: ${JSON.stringify(
    productIds,
  )} search:"${filter.search || ''}" }) {
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
            media {
              id
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
            }
          }
        }
      }
    }
  `;
};

const b2cQuery = (productIds, filter: myProductsDTO): string => {
  return gql`
    query {
      products(${validatePageFilter(
        filter,
      )}, channel: "default-channel", filter: { ids: ${JSON.stringify(
    productIds,
  )} search:"${filter.search || ''}" }) {
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
              id
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
  filter: myProductsDTO,
  isb2c = false,
) => {
  return graphqlQueryCheck(
    b2bQuery(variantsIds, filter),
    b2cQuery(variantsIds, filter),
    isb2c,
  );
};
