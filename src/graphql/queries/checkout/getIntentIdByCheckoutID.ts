import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const federationQuery = (checkoutId: string) => {
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

export const getIntentIdByCheckoutIdQuery = (checkoutId: string) => {
  return graphqlQueryCheck(
    federationQuery(checkoutId),
    federationQuery(checkoutId),
  );
};
