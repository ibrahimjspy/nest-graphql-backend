import { gql } from 'graphql-request';

export const validateCheckoutQuery = (checkoutId: string) => {
  return gql`
    query {
      validateCartAmounts(Input: { checkoutId: "${checkoutId}" }) {
        ... on CartTotalAmountErrorResponse {
          __typename
          isValid
          message
        }
        ... on VendorsMinimumAmountErrorResponse {
          __typename
          isValid
          errorBundles {
            message
            bundleId
          }
        }
        ... on ResultError {
          __typename
          errors
          message
        }
        ... on ValidateAmountsResponse {
          __typename
          isValid
          message
        }
      }
    }
  `;
};
