import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const federationQuery = (id: string): string => {
  return gql`
          query {
            order(id: "${id}") {
              number
              shippingPrice {
                gross {
                  amount
                }
              }
              status
              shippingMethods {
                name
                id
                description
              }
              userEmail
              billingAddress {
                postalCode
                firstName
                lastName
                streetAddress1
                streetAddress2
              }
              shippingAddress {
                postalCode
                firstName
                lastName
                streetAddress1
                streetAddress2
              }
              created
              id
              user {
                firstName
                lastName
                email
              }
              lines {
                id
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
                  stocks {
                    quantity
                  }
                  attributes {
                    attribute {
                      name
                    }
                    values {
                      name
                    }
                  }
                  media {
                    url
                  }
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
