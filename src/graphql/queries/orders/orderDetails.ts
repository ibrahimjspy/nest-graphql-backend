import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const b2bQuery = (id: string): string => {
  return gql`
    query {
      order(id: "${id}") {
        number
        metadata {
          key
          value
        }
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
          id
          firstName
          lastName
          companyName
          streetAddress1
          streetAddress2
          city
          cityArea
          postalCode
          country{
            code
          }
          countryArea
          phone
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
          quantityToFulfill
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

const b2cQuery = (id: string): string => {
  return gql`
    query {
      order(id: "${id}") {
        id
        status
        number
        shippingAddress {
          id
          phone
          firstName
          lastName
          streetAddress1
          city
          postalCode
          isDefaultBillingAddress
          isDefaultShippingAddress
          country {
            code
            country
          }
        }
        billingAddress {
          id
          phone
          firstName
          lastName
          streetAddress1
          city
          postalCode
          isDefaultBillingAddress
          isDefaultShippingAddress
          country {
            code
            country
          }
        }
        subtotal {
          net {
            currency
            amount
          }
          tax {
            currency
            amount
          }
        }
        total {
          gross {
            currency
            amount
          }
        }
        lines {
          id
          productName
          variantName
          quantity
          variant {
            product {
              media {
                url
                alt
              }
            }
          }
          thumbnail {
            url
            alt
          }
          unitPrice {
            gross {
              currency
            amount
            }
          }
          totalPrice {
            gross {
              currency
            amount
            }
          }
        }
        shippingPrice {
          gross {
            currency
            amount
          }
        }
      }
    }
  `;
};

// returns shop order details query based on federation and mock check
export const orderDetailsQuery = (id: string) => {
  return graphqlQueryCheck(b2bQuery(id), b2cQuery(id));
};
