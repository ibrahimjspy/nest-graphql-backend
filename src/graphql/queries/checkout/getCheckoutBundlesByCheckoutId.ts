import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
const b2bQuery = (checkoutId: string, isSelected: any): string => {
  return gql`
    query {
      checkoutBundles(
        Filter: {
          checkoutId: "${checkoutId}"
          isSelected: ${isSelected}
        }
      ) {
        ... on CheckoutBundlesType {
          __typename
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
          message
          errors
        }
      }
    }
  `;
};

export const getCheckoutBundlesbyCheckoutIdQuery = (
  checkoutId: string,
  isSelected: any,
) => {
  return graphqlQueryCheck(
    b2bQuery(checkoutId, isSelected),
    b2bQuery(checkoutId, isSelected),
  );
};
