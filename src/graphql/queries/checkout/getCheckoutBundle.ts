import { gql } from 'graphql-request';
export const getCheckoutBundleQuery = (
  userEmail: string,
  isSelected: any,
  productDetails = true,
) => {
  if (productDetails) {
    return gql`
    query {
      checkoutBundles(
        Filter: { userEmail: "${userEmail}",isSelected: ${isSelected} }
      ) {
        ... on CheckoutBundlesType {
          __typename
          totalAmount
          subTotal
          taxes
          discounts
          userEmail
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
  }
  return gql`
    query {
      checkoutBundles(
        Filter: { userEmail: "${userEmail}" }
      ) {
        ... on CheckoutBundlesType {
          __typename
          checkoutId
          userEmail
          checkoutBundles {
            checkoutBundleId
            isSelected
            quantity
            bundle {
              id
              productVariants {
                quantity
                productVariant {
                  id             
                }
              }
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
