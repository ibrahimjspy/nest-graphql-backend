import { gql } from 'graphql-request';
import { checkoutBundlesFragment } from 'src/graphql/fragments/checkout/checkoutBundles';
import { resultErrorFragment } from 'src/graphql/fragments/errors';

export const deleteCheckoutBundlesMutation = (
  checkoutBundleIds: Array<string>,
  userEmail: string,
) => {
  return gql`
    mutation {
      deleteCheckoutBundles(
        Input: {
          userEmail: "${userEmail}"
          checkoutBundleIds: ${JSON.stringify(checkoutBundleIds)}
        }
      ) {
        ... on CheckoutBundlesType {
          ... CheckoutBundles
        }
        __typename
        ... on ResultError {
          __typename
          ... ResultError
        }
      }
    }
    ${checkoutBundlesFragment}
    ${resultErrorFragment}
  `;
};
