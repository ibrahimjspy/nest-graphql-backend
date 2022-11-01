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
                }
              }
            }
          }
          selectedMethods {
            method {
              id
              shippingMethodId
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