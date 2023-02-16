import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const b2bQuery = (checkoutId: string) => {
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

export const disableUserCartSessionMutation = (checkoutId: string) => {
  return graphqlQueryCheck(b2bQuery(checkoutId), b2bQuery(checkoutId));
};
