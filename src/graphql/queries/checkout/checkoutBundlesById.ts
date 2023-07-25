import { gql } from 'graphql-request';
import {
  DEFAULT_MEDIA_LARGE_SIZE,
  DEFAULT_MEDIA_SIZE,
  DEFAULT_THUMBNAIL_SIZE,
} from 'src/constants';
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
                thumbnail(size: ${DEFAULT_THUMBNAIL_SIZE}) {
                  url
                }
                media {
                  url(size:${DEFAULT_MEDIA_LARGE_SIZE})
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
                  channelListings {
                    price {
                      amount
                    }
                  }
                  media {
                    url(size:${DEFAULT_MEDIA_SIZE})
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
