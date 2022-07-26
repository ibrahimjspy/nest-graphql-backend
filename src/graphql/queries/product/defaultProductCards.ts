import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/public/graphqlQueryToggle';

export const federationQuery = () => {
  return gql`
    query {
      marketplaceShops {
        edges {
          node {
            id
            name
            isActive
            products {
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
