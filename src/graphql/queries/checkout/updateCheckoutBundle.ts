import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { removeKeysQuoutes } from 'src/core/utils/helpers';
const federationQuery = (userEmail: string, checkoutBundles: any[]): string => {
  return gql`
    mutation {
      updateCheckoutBundles(
        Input: {
          userEmail: "${userEmail}"
          checkoutBundles: ${removeKeysQuoutes(checkoutBundles)}
        }
      ) {
        __typename
        ... on CheckoutBundlesType {
          __typename
          totalAmount
          subTotal
          taxes
          discounts
          checkoutId
          checkoutBundles {
            checkoutBundleId
            isSelected
            quantity
            bundle {
              id
              name
              description
              slug
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
              productVariants {
                quantity
                productVariant {
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
               
                  pricing {
                    price {
                      net {
                        amount
                        currency
                      }
                    }
                    onSale
                    discount {
                      gross {
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
            }
            shop {
              id
              name
            }
          }
        }

        ... on ResultError {
          __typename
          errors
          message
        }
      }
    }
  `;
};

export const updateCheckoutBundleQuery = (
  userEmail: string,
  checkoutBundles: any[],
) => {
  return graphqlQueryCheck(
    federationQuery(userEmail, checkoutBundles),
    federationQuery(userEmail, checkoutBundles),
  );
};
