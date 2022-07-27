import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/public/graphqlQueryToggle';

const federationQuery = (id): string => {
  return gql`
    query {
      products(
        first: 6
        channel: "default-channel"
        filter: { productTypes: ["${id}"] }
      ) {
        edges {
          node {
            id
            name
            slug
            isAvailable
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
