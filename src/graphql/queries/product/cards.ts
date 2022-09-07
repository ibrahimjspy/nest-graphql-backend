import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/public/graphqlQueryToggle';

export const federationQuery = (): string => {
  return gql`
    query {
      products(
        first: 6
        channel: "default-channel"
        filter: { categories: ["Q2F0ZWdvcnk6MTM="] }
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