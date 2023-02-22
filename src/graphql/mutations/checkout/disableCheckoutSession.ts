import { gql } from 'graphql-request';

export const disableUserCartSessionMutation = (checkoutId: string) => {
  return gql`
    mutation {
      disableUserCartSession(
        Input: {
          checkoutId: "${checkoutId}"
        }
      ) {
        ... on ResultData {
          __typename
          data
          message
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
