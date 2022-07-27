import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/public/graphqlQueryToggle';

const federationQuery = (slug): string => {
  return gql`
    query {
      category(slug: "${slug}") {
        products(first: 20, channel: "default-channel") {
          edges {
            node {
              id
              slug
              variants {
                sku
              }
              thumbnail {
                url
              }
              attributes {
                attribute {
                  name
                }
                values {
                  name
                }
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
                    gross {
                      amount
                    }
                  }
                }
              }
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
export const productListPageQuery = (slug) => {
  return graphqlQueryCheck(federationQuery(slug), mockQuery());
};
