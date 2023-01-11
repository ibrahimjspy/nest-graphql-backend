import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { removeKeysQuoutes } from 'src/core/utils/helpers';
const federationQuery = (
  userEmail: string,
  bundles: Array<{
    bundleId: string;
    quantity: number;
    isSelected?: boolean;
    lines?: Array<string>;
  }>,
): string => {
  return gql`
    mutation {
      addCheckoutBundles(
        Input: {
          userEmail: "${userEmail}"
          bundles: ${removeKeysQuoutes(bundles)}
        }
      ) {
        ... on CheckoutBundlesType {
          checkoutId
          userEmail
          checkoutBundles {
            checkoutBundleId
            quantity
            price
            bundle {
              id
            }
            isSelected
          }
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

export const addCheckoutBundleQuery = (
  userEmail: string,
  bundles: Array<{ bundleId: string; quantity: number }>,
) => {
  return graphqlQueryCheck(
    federationQuery(userEmail, bundles),
    federationQuery(userEmail, bundles),
  );
};
