import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const federationQuery = (
  action: string,
  userEmail: string,
  checkoutBundles: Array<string>,
) => {
  return gql`
    mutation {
      updateCheckoutBundleStatus(
        Input: {
          checkoutBundleIds: ${JSON.stringify(checkoutBundles)}
          userEmail: "${userEmail}"
          action: "${action}"
        }
      ) {
        __typename
        ... on ResultError {
          __typename
          errors
          message
        }
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
      }
    }
  `;
};

export const updateCheckoutBundleStateMutation = (
  action: string,
  userEmail: string,
  checkoutBundles: Array<string>,
) => {
  return graphqlQueryCheck(
    federationQuery(action, userEmail, checkoutBundles),
    federationQuery(action, userEmail, checkoutBundles),
  );
};
