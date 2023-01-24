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
        totalCaptured {
          amount
        }
        total {
          gross {
            amount
          }
        }
        paymentStatus
        payments {
          id
          total {
            amount
          }
        }
        status
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
        fulfillments {
          status
          lines {
            id
            quantity
            orderLine {
              quantity
              totalPrice {
                gross {
                  amount
                }
              }
              variant {
                id
                sku
                pricing {
                  price {
                    gross {
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
                media {
                  url
                }
                product {
                  id
                  name
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
              }
            }
          }
        }
        lines {
          id
          productName
          quantity
          quantityFulfilled
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
            sku
            attributes {
              attribute {
                name
              }
              values {
                name
              }
            }
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
            media {
              url
            }
            product {
              id
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
