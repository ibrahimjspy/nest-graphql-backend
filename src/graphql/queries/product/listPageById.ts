import { gql } from 'graphql-request';
import { DEFAULT_CHANNEL } from 'src/constants';
import { graphqlQueryCheck } from 'src/public/graphqlQueryToggle';

const federationQuery = (id): string => {
  return gql`
    query {
      products(
        first: 100
        channel: "${DEFAULT_CHANNEL}"
        filter: { categories: ["${id}"] }
      ) {
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

export const productListPageQuery = (id: string) => {
  return graphqlQueryCheck(federationQuery(id), mockQuery());
};
