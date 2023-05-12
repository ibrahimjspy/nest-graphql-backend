import { gql } from 'graphql-request';
import { checkoutBundleFragment } from '../bundle';

export const checkoutBundleLineFragmentV2 = gql`
  fragment CheckoutBundleLine on CheckoutBundleTypeV2 {
    isSelected
    checkoutBundleId
    bundle {
      ...Bundle
    }
  }
  ${checkoutBundleFragment}
`;
