import { gql } from 'graphql-request';
//WARN currently no use of this query in any ql resolvers !!
export const productDetailsQuery = () => {
  return gql`
    query {
      product(slug: "apple-juice", channel: "default-channel") {
        name
        id
        slug
        media {
          url
        }
        description
        variants {
          id
          pricing {
            price {
              gross {
                currency
                amount
              }
            }
          }
          attributes {
            attribute {
              name
            }
            values {
              name
            }
          }
        }
        attributes {
          attribute {
            name
          }
          values {
            name
          }
        }
        pricing {
          priceRange {
            start {
              gross {
                currency
                amount
              }
            }
            stop {
              gross {
                currency
                amount
              }
            }
          }
        }
      }
    }
  `;
};
