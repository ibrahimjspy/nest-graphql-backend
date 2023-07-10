import { gql } from 'graphql-request';
import { productDetailsFragment } from '../product';
import { attributeFragment } from '../attributes';
import { checkoutShopDetailsFragment } from '../shop';
import { selectedShippingMethodsFragment } from './shipping/shippingMethod';
import { checkoutPricingFragment } from '../pricing';
import { bundleDetailsFragment } from '../bundle';
import { productVariantDetailsFragment } from '../productVariant';
import { DEFAULT_MEDIA_LARGE_SIZE } from 'src/constants';

export const checkoutBundlesFragment = gql`
  fragment CheckoutBundles on CheckoutBundlesType {
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
        ...Bundle
        product {
          ...Product
          thumbnail {
            url
          }
          media {
            url(size:${DEFAULT_MEDIA_LARGE_SIZE})
          }
        }
        productVariants {
          quantity
          productVariant {
            ...ProductVariant
            attributes {
              ...Attribute
            }
            media {
              url(size:${DEFAULT_MEDIA_LARGE_SIZE})
            }
            pricing {
              ...Price
            }
          }
        }
        shop {
          ...Shop
        }
      }
    }
    selectedMethods {
      ...CheckoutShippingMethods
    }
  }
  ${productDetailsFragment}
  ${attributeFragment}
  ${checkoutShopDetailsFragment}
  ${selectedShippingMethodsFragment}
  ${checkoutPricingFragment}
  ${bundleDetailsFragment}
  ${productVariantDetailsFragment}
`;
