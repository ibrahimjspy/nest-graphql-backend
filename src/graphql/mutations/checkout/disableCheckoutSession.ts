import { gql } from 'graphql-request';

export const disableUserCartSessionMutation = (checkoutIds: string[]) => {
  return gql`
    mutation {
      disableUserCartSession(
        Input: {
          checkoutIds: ${JSON.stringify(checkoutIds)}
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
