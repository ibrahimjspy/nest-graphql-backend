import { gql } from 'graphql-request';

export const updateCheckoutBundleStateMutation = (
  action: boolean,
  userEmail: string,
  checkoutBundles: Array<string>,
) => {
  return gql`
    mutation {
      updateCheckoutBundleStatus(
        input: {
          checkoutBundleIds: ${JSON.stringify(checkoutBundles)}
          userEmail: "${userEmail}"
          action: ${action}
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
