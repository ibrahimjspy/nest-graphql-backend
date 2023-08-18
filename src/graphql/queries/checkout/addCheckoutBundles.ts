import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { graphqlObjectTransform } from 'src/core/utils/helpers';
import { checkoutBundlesFragment } from 'src/graphql/fragments/checkout/checkoutBundles';
import { resultErrorFragment } from 'src/graphql/fragments/errors';
const federationQuery = (
  userEmail: string,
  bundles: Array<{
    bundleId: string;
    quantity: number;
    isSelected?: boolean;
    lines?: Array<string>;
  }>,
  productDetails,
): string => {
  if (!productDetails) {
    return gql`
    mutation {
      addCheckoutBundles(
        Input: {
          userEmail: "${userEmail}"
          bundles: ${graphqlObjectTransform(bundles)}
        }
      ) {
        ... on CheckoutBundlesType {
          userEmail
          checkoutIds
          checkoutBundles{
            checkoutBundleId
            checkoutId
            bundle {
              id
              shop {
                id
                fields {
                  name
                  values
                }
              }
            }
          }
        }
        ... on ResultError {
          ... ResultError
        }
      }
    }
    ${resultErrorFragment}
  `;
  }
  return gql`
    mutation {
      addCheckoutBundles(
        Input: {
          userEmail: "${userEmail}"
          bundles: ${graphqlObjectTransform(bundles)}
        }
      ) {
        ... on CheckoutBundlesType {
          ... CheckoutBundles
        }
        ... on ResultError {
          ... ResultError
        }
      }
    }
    ${checkoutBundlesFragment}
    ${resultErrorFragment}
  `;
};

export const addCheckoutBundleQuery = (
  userEmail: string,
  bundles: Array<{ bundleId: string; quantity: number }>,
  productDetails = false,
) => {
  return graphqlQueryCheck(
    federationQuery(userEmail, bundles, productDetails),
    federationQuery(userEmail, bundles, productDetails),
  );
};
