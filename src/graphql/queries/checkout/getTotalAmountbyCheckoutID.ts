import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
const b2bQuery = (checkoutID: string): string => {
  return gql`
    query MyQuery {
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

export const getTotalamountByCheckoutIdQuery = (checkoutID: string) => {
  return graphqlQueryCheck(b2bQuery(checkoutID), b2bQuery(checkoutID));
};
