import { gql } from 'graphql-request';
import { taxedPricingFragment } from '../pricing';

export const checkoutBundleLineFragment = gql`
  fragment CartDetails on CartType {
    checkoutId
    validations
    userEmail
    totalPrice {
      ...Price
    }
  }
  ${taxedPricingFragment}
`;
