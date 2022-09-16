import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/public/graphqlQueryToggle';

const federationQuery = (
  checkoutBundleIds: Array<string>,
  checkoutId: string,
) => {
  // query linking with backend
  return gql`
  mutation {
    deleteCheckoutBundles(
      Input: {
        checkoutBundleIds: ${JSON.stringify(checkoutBundleIds)},
        checkoutId: "${checkoutId}"
      }
    ) {
      __typename
      ... on ResultData {
        message
      }
      ... on ResultError {
        errors
        message
      }
    }
  }
  `;
};

export const deleteCheckoutBundlesQuery = (
  checkoutBundleIds: Array<string>,
  checkoutId: string,
) => {
  return graphqlQueryCheck(
    federationQuery(checkoutBundleIds, checkoutId),
    federationQuery(checkoutBundleIds, checkoutId),
  );
};
