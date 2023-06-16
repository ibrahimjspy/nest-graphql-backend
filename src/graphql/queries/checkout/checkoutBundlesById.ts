import { gql } from 'graphql-request';
import { metadataFragment } from 'src/graphql/fragments/attributes';
import { checkoutShopDetailsFragment } from 'src/graphql/fragments/shop';

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
          totalAmount
          subTotal
          taxes
          discounts
          userEmail
          checkoutBundles {
            checkoutBundleId
            isSelected
            quantity
            price
            bundle {
              id
              name
              isOpenBundle
              description
              slug
              product {
                name
                id
                metadata {
                  ...Metadata
                }
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
                  preorder {
                    globalThreshold
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
                  product {
                    category {
                      id
                      name
                      ancestors(first: 100) {
                        edges {
                          node {
                            id
                            name
                          }
                        }
                      }
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
                ... Shop
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
    ${checkoutShopDetailsFragment}
    ${metadataFragment}
  `;
};
