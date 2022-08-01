import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/public/graphqlQueryToggle';

export const federationQuery = (): string => {
  return gql`
    query {
      marketplaceShops {
        edges {
          node {
            id
            name
            products {
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
