import { gql } from 'graphql-request';
import { attributeFragment } from './attributes';
import { checkoutProductDetailsFragment } from './product';
import { checkoutPricingFragmentV2 } from './pricing';

export const productVariantDetailsFragment = gql`
  fragment ProductVariant on ProductVariant {
    id
    name
    sku
  }
`;

export const checkoutProductVariantFragment = gql`
  fragment SaleorProductVariant on ProductVariant {
    id
    product {
      ...CheckoutProductDetails
    }
    attributes {
      ...Attribute
    }
    pricing {
      ...VariantPrice
    }
    media {
      ...Media
    }
  }
  ${attributeFragment}
  ${checkoutPricingFragmentV2}
  ${checkoutProductDetailsFragment}
`;

export const bundleVariantFragment = gql`
  fragment BundleVariants on BundleProductVariantType {
    quantity
    productVariant {
      ...SaleorProductVariant
    }
  }
  ${checkoutProductVariantFragment}
`;

export const productVariantStockFragment = gql`
  fragment Stock on Stock {
    quantity
    quantityReserved
    quantityAllocated
  }
`;
