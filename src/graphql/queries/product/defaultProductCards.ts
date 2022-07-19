import { gql } from 'graphql-request';
//WARN currently no use of this query in any ql resolvers !!
export const productCardQuery = () => {
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
