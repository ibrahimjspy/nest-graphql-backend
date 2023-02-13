import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const federationQuery = (userId: string): string => {
  return gql`
    query {
      marketplaceCheckout(
          userId: "${userId}"
      ) {
        ... on CheckoutBundlesType {
          __typename
          totalAmount
          subTotal
          taxes
          discounts
          checkoutId
          userId
          bundles {
            checkoutBundleId
            isSelected
            quantity
            bundle {
              id
              name
              description
              slug
              variants {
                quantity
                variant {
                  id
                  name
                  sku
                  attributes {
                      attribute {
                          name
                      }
                      values {
                          name
                      }
                  }
                  product {
                      name
                      id
                      thumbnail {
                        url
                      }
                      media {
                        url
                      }
                  }
                  pricing {
                    price {
                      net {
                        amount
                        currency
                      }
                    }
                    onSale
                    discount{
                      gross{
                        amount
                        currency
                      }
                    }
                  }
                }
              }
              shop {
                id
                name
                madeIn
                shippingMethods {
                  id
                  shippingMethodId
                  shippingMethodTypeId
                }
              }
            }
          }
          selectedMethods {
            method {
              id
              shippingMethodId
              shippingMethodTypeId
            },
            shop {
              id
              name
            }
          }
        }
        ... on ResultError {
          __typename
          message
          errors
        }
      }
    }
  `;
};

export const getMarketplaceCheckoutQuery = (id: string) => {
  return graphqlQueryCheck(federationQuery(id), federationQuery(id));
};
