import { gql } from 'graphql-request';
import { productDetailsFragment } from '../product';
import { attributeFragment } from '../attributes';
import { checkoutShopDetailsFragment } from '../shop';
import { selectedShippingMethodsFragment } from './shipping/shippingMethod';
import { checkoutPricingFragment } from '../pricing';
import { bundleDetailsFragment } from '../bundle';
import { productVariantDetailsFragment } from '../productVariant';

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
            url
          }
        }
        productVariants {
          quantity
          productVariant {
            ...ProductVariant
            attributes {
              ...Attribute
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