import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const federationQuery = (
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
        __typename
        ... on ResultError {
          message
          data
        }
      }
    }
  `;
};

export const deleteCheckoutBundlesMutation = (
  checkoutBundleIds: Array<string>,
  userEmail: string,
) => {
  return graphqlQueryCheck(
    federationQuery(checkoutBundleIds, userEmail),
    federationQuery(checkoutBundleIds, userEmail),
  );
};
