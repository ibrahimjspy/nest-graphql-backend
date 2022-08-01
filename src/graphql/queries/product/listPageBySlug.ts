import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/public/graphqlQueryToggle';

const federationQuery = (id): string => {
  return gql`
    query {
      products(
        first: 6
        channel: "default-channel"
        filter: { categories: ["${id}"] }
      ) {
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
            }
            thumbnail {
              url
            }
            name
            description
            pricing {
              priceRange {
                start {
                  currency
                  gross {
                    amount
                  }
                }
                stop {
                  currency
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
const mockQuery = () => {
  return gql`
    query {
      category(slug: "accessories") {
        products(first: 20, channel: "default-channel") {
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
export const productListPageQuery = (id) => {
  return graphqlQueryCheck(federationQuery(id), mockQuery());
};
