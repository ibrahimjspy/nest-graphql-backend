import { gql } from 'graphql-request';
import { checkoutBundlesFragment } from 'src/graphql/fragments/checkout/checkoutBundles';
import { resultErrorFragment } from 'src/graphql/fragments/errors';

export const updateCheckoutBundleStateMutation = (
  action: boolean,
  userEmail: string,
  checkoutBundles: Array<string>,
) => {
  return gql`
    mutation {
      updateCheckoutBundleStatus(
        input: {
          checkoutBundleIds: ${JSON.stringify(checkoutBundles)}
          userEmail: "${userEmail}"
          action: ${action}
        }
      ) {
        __typename
        ... on ResultError {
          __typename
          ... ResultError
        }
        ... on CheckoutBundlesType {
          ... CheckoutBundles
        }
      }
    }
    ${checkoutBundlesFragment}
    ${resultErrorFragment}
  `;
};
