import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const federationQuery = (email: string, checkoutId: string) => {
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

export const updateCartBundlesCheckoutIdMutation = (
  email: string,
  checkoutId: string,
) => {
  return graphqlQueryCheck(
    federationQuery(email, checkoutId),
    federationQuery(email, checkoutId),
  );
};
