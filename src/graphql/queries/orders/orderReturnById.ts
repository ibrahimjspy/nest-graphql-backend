import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const federationQuery = (id: string): string => {
  return gql`
    query {
      order(id: "${id}") {
        number
        created
        paymentStatus
        shippingPrice {
          gross {
            amount
          }
        }
        lines {
          productName
          quantity
          variant {
            product {
              name
              description
              channel
              thumbnail {
                url
              }
              media {
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
          totalPrice {
            net {
              amount
            }
            gross {
              amount
            }
          }
        }
        fulfillments {
          status
        }
        user {
          firstName
          lastName
          email
          note
          addresses {
            phone
          }
        }
        payments {
          paymentMethodType
          total {
            currency
            amount
          }
        }
        shippingAddress {
          firstName
          lastName
          streetAddress1
          streetAddress2
          city
          cityArea
          postalCode
          country {
            code
          }
        }
        billingAddress {
          firstName
          lastName
          companyName
          streetAddress1
          streetAddress2
          city
          postalCode
          countryArea
          country {
            code
          }
        }
      }
    }
  `;
};

// returns shop order details query based on federation and mock check
export const orderReturnDetailQuery = (id: string) => {
  return graphqlQueryCheck(federationQuery(id), federationQuery(id));
};
