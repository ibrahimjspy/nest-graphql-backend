import { gql } from 'graphql-request';

export const updateCartBundlesCheckoutIdMutation = (
  email: string,
  checkoutId: string,
) => {
  return gql`
    mutation MyMutation {
      updateUserCartBundlesCheckoutId(
        Input: { checkoutId: "${checkoutId}", userEmail: "${email}" }
      ) {
        ... on CheckoutBundleId {
          checkoutId
        }
        ... on ResultError {
          __typename
          errors
          message
        }
      }
    }
  `;
};
