import { gql } from 'graphql-request';
import { DEFAULT_CHANNEL, LIST_PAGE_SIZE } from 'src/constants';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const federationQuery = (id): string => {
  return gql`
    query {
      products(
        first: ${LIST_PAGE_SIZE}
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

export const productListPageQuery = (id: string) => {
  return graphqlQueryCheck(federationQuery(id), mockQuery());
};
