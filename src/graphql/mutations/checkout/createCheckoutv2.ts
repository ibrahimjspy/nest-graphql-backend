import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const federationQuery = (email: string) => {
  return gql`
    mutation MyMutation {
      createBundleCheckout(Input: { userEmail: "${email}" }) {
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

export const createCheckoutv2Mutation = (email: string) => {
  return graphqlQueryCheck(federationQuery(email), federationQuery(email));
};
