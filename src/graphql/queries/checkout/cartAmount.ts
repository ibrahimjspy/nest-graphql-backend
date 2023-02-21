import { gql } from 'graphql-request';
export const cartAmountQuery = (checkoutID: string): string => {
  return gql`
    query {
      getUserCartAmount(
        Filter: {
          checkoutId: "${checkoutID}"
        }
      ) {
        ... on GetUserCartTotalAmount {
          __typename
          checkoutId
          totalAmount
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
