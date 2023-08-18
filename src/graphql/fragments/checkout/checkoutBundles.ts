import { gql } from 'graphql-request';
import { productDetailsFragment } from '../product';
import { attributeFragment } from '../attributes';
import { checkoutShopDetailsFragment } from '../shop';
import { channelListingPricingFragment } from '../pricing';
import { bundleDetailsFragment } from '../bundle';
import { productVariantDetailsFragment } from '../productVariant';
import { DEFAULT_MEDIA_SIZE, DEFAULT_THUMBNAIL_SIZE } from 'src/constants';

export const checkoutBundlesFragment = gql`
  fragment CheckoutBundles on CheckoutBundlesType {
    __typename
    userEmail
    totalAmount
    subTotal
    taxes
    discounts
    checkoutIds
    checkoutBundles {
      checkoutId
      checkoutBundleId
      isSelected
      quantity
      price
      bundle {
        ...Bundle
        product {
          ...Product
          thumbnail(size: ${DEFAULT_THUMBNAIL_SIZE}) {
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
            media {
              url(size:${DEFAULT_MEDIA_SIZE})
            }
            channelListings {
              ... ChannelPricing
            }
          }
        }
        shop {
          ...Shop
        }
      }
    }
  }
  ${productDetailsFragment}
  ${attributeFragment}
  ${checkoutShopDetailsFragment}
  ${bundleDetailsFragment}
  ${productVariantDetailsFragment}
  ${channelListingPricingFragment}
`;
