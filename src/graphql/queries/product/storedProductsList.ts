import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const b2bQuery = (productIds): string => {
  return gql`
    query {
      products(first: 100, filter: { ids: ${JSON.stringify(productIds)} }) {
        edges {
          node {
            id
            name
            description
            slug
            thumbnail {
              url
            }
            media {
              url
            }
            defaultVariant {
              sku
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
                    currency
                    amount
                  }
                }
              }
            }
            category {
              name
              id
              ancestors(first: 5) {
                edges {
                  node {
                    id
                    name
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
          }
        }
      }
    }
  `;
};

export const getStoredProductsListQuery = (
  productIds: string[],
  isb2c = false,
) => {
  return graphqlQueryCheck(b2bQuery(productIds), b2bQuery(productIds), isb2c);
};
