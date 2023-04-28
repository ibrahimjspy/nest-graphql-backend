import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { stringifyObject } from 'src/core/utils/helpers';
const federationQuery = (
  userEmail: string,
  bundles: Array<{
    bundleId: string;
    quantity: number;
    isSelected?: boolean;
    lines?: Array<string>;
  }>,
): string => {
  return gql`
    mutation {
      addCheckoutBundles(
        Input: {
          userEmail: "${userEmail}"
          bundles: ${stringifyObject(bundles)}
        }
      ) {
        ... on CheckoutBundlesType {
          __typename
          userEmail
          totalAmount
          subTotal
          taxes
          discounts
          checkoutId
          checkoutBundles {
            checkoutBundleId
            isSelected
            quantity
            price
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

export const addCheckoutBundleQuery = (
  userEmail: string,
  bundles: Array<{ bundleId: string; quantity: number }>,
) => {
  return graphqlQueryCheck(
    federationQuery(userEmail, bundles),
    federationQuery(userEmail, bundles),
  );
};
