import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const federationQuery = (
  action: string,
  userEmail: string,
  checkoutBundles: Array<string>,
) => {
  return gql`
    mutation {
      updateCheckoutBundleStatus(
        Input: {
          checkoutBundleIds: ${JSON.stringify(checkoutBundles)}
          userEmail: "${userEmail}"
          action: "${action}"
        }
      ) {
        __typename
        ... on ResultError {
          __typename
          errors
          message
        }
        ... on CheckoutBundleStatusType {
          __typename
          checkoutBundles {
          checkoutBundleId
          isSelected
          userEmail
          }
    }
      }
    }
  `;
};

export const updateCheckoutBundleState = (
  action: string,
  userEmail: string,
  checkoutBundles: Array<string>,
) => {
  return graphqlQueryCheck(
    federationQuery(action, userEmail, checkoutBundles),
    federationQuery(action, userEmail, checkoutBundles),
  );
};
