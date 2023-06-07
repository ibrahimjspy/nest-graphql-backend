import { gql } from 'graphql-request';
import { bundleVariantFragment } from './productVariant';

export const bundleDetailsFragment = gql`
  fragment Bundle on BundleViewType {
    id
    name
    isOpenBundle
    description
    slug
    price
  }
`;

export const checkoutBundleFragment = gql`
  fragment Bundle on BundleViewType {
    id
    name
    productVariants {
      ...BundleVariants
    }
  }
  ${bundleVariantFragment}
`;
