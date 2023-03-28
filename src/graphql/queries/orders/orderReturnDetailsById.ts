import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const federationQuery = (id: string): string => {
  return gql`
    query {
      order(id: "${id}") {
        id
        number
        created
        status
        paymentStatus
        shippingPrice {
          gross {
            amount
          }
        }
        fulfillments {
          id
          created
          status
          lines {
            quantity
            orderLine {
              id
              productName
              quantity
              variant {
                product {
                  name
                  description
                  channel
                  metadata {
                    key
                    value
                  }
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
          }
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

// return order detail which is return back by end customer
export const orderReturnDetailQuery = (id: string) => {
  return graphqlQueryCheck(federationQuery(id), federationQuery(id));
};
