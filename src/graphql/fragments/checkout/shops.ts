import { gql } from 'graphql-request';
import { checkoutBundleLineFragmentV2 } from './lines';

export const checkoutShopFragment = gql`
  fragment CartShops on CartShop {
    id
    name
    validations
    lines {
      ...CheckoutBundleLine
    }
  }
  ${checkoutBundleLineFragmentV2}
`;
