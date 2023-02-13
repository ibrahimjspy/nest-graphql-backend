import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { removeKeysQuoutes } from 'src/core/utils/helpers';
const federationQuery = (userEmail: string, checkoutBundles: any[]): string => {
  return gql`
    mutation {
      updateCheckoutBundles(
        Input: {
          userEmail: "${userEmail}"
          checkoutBundles: ${removeKeysQuoutes(checkoutBundles)}
        }
      ) {
        __typename
        ... on CheckoutBundlesType {
          totalAmount
          subTotal
          taxes
          discounts
          checkoutBundles {
            bundle {
              id
            }
            quantity
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

export const updateCheckoutBundleQuery = (
  userEmail: string,
  checkoutBundles: any[],
) => {
  return graphqlQueryCheck(
    federationQuery(userEmail, checkoutBundles),
    federationQuery(userEmail, checkoutBundles),
  );
};
