import { gql } from 'graphql-request';
import { DEFAULT_THUMBNAIL_SIZE } from 'src/constants';
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
                  thumbnail(size: ${DEFAULT_THUMBNAIL_SIZE}) {
                    url
                  }
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
        number
        paymentStatus
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
        transactions {
          metadata {
            key
            value
          }
          type
          chargedAmount {
            amount
          }
        }
        fulfillments {
          status
          id
          trackingNumber
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
                  thumbnail(size: ${DEFAULT_THUMBNAIL_SIZE}) {
                    url
                  }
                  metadata {
                    key
                    value
                  }
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
              metadata {
                key
                value
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
  return graphqlQueryCheck(b2bQuery(id), b2cQuery(id));
};
