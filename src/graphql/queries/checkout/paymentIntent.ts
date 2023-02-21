import { gql } from 'graphql-request';

export const getPaymentIntentQuery = (checkoutId: string) => {
  return gql`
    query {
      getPaymentIntentAgainstUserCheckout(
        Filter: {
          checkoutId: "${checkoutId}"
        }
      ) {
        ... on UserPaymentIntent {
          __typename
          intentId
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
