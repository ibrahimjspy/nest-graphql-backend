import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { graphqlObjectTransform } from 'src/core/utils/helpers';
import { checkoutBundlesFragment } from 'src/graphql/fragments/checkout/checkoutBundles';
import { resultErrorFragment } from 'src/graphql/fragments/errors';
const federationQuery = (userEmail: string, checkoutBundles: any[]): string => {
  return gql`
    mutation {
      updateCheckoutBundles(
        Input: {
          userEmail: "${userEmail}"
          checkoutBundles: ${graphqlObjectTransform(checkoutBundles)}
        }
      ) {
        __typename
        ... on CheckoutBundlesType {
          ...CheckoutBundles
        }

        ... on ResultError {
          __typename
          ...ResultError
        }
      }
    }
    ${checkoutBundlesFragment}
    ${resultErrorFragment}
  `;
};

export const updateCheckoutBundleQuery = (
  userEmail: string,
  checkoutBundles: any[],
) => {
  return graphqlQueryCheck(
    federationQuery(userEmail, checkoutBundles),
    federationQuery(userEmail, checkoutBundles),
  );
};
