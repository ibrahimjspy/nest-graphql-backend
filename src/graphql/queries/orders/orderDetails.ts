import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const federationQuery = (id: string): string => {
  return gql`
query {
      order(id: "${id}") {
        number
        shippingPrice{
          gross{
            amount
          }
        }
        shippingMethods{
          name
          id
          description
        }
        created
        id
        user {
          firstName
          lastName
          email
          defaultShippingAddress {
            firstName
            lastName
            city
            phone
            streetAddress1
            streetAddress2
          }
          defaultBillingAddress {
            firstName
            lastName
            city
            phone
            streetAddress1
            streetAddress2
          }
        }
        lines { 
          productName
          quantity
          productSku
          
          totalPrice {
            net {
              amount
            }
            gross {
              amount
            }
          }
          unitPrice {
            net {
              amount
            }
            gross {
              amount
            }
          }
          variant {
            quantityOrdered
            quantityAvailable
            pricing {
              price {
                gross {
                  amount
                }
                net {
                  amount
                }
              }
            }
            product {
              id
              media {
                url
              }
              thumbnail {
                url
              }
            }
          }
        }
      }
    }
  `;
};

// returns shop order details query based on federation and mock check
export const orderDetailsQuery = (id: string) => {
  return graphqlQueryCheck(federationQuery(id), federationQuery(id));
};
