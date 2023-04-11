import { gql } from 'graphql-request';
import { DEFAULT_CHANNEL, DEFAULT_THUMBNAIL_SIZE } from 'src/constants';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

export const federationQuery = (): string => {
  return gql`
    query {
      products(
        first: 6
        channel: "${DEFAULT_CHANNEL}"
        filter: { categories: [], isAvailable: true }
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
const mockQuery = () => {
  return gql`
    query {
      products {
        image
        title
        description
        id
        slug
        color_variant
        sku
        resale_price
        product_cost
      }
    }
  `;
};

export const productCardsDefaultQuery = () => {
  return graphqlQueryCheck(federationQuery(), mockQuery());
};
