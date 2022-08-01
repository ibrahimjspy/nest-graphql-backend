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

export const productCardsByListIdQuery = (id) => {
  return graphqlQueryCheck(federationQuery(id), mockQuery());
};
