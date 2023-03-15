import { gql } from 'graphql-request';

export const checkoutBundlesByIdQuery = (
  checkoutId: string,
  isSelected: any,
): string => {
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
          message
          errors
        }
      }
    }
  `;
};
