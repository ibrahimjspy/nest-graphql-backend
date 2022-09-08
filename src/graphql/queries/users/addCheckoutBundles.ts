import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/public/graphqlQueryToggle';

const federationQuery = (
  checkoutId: string,
  userId: string,
  bundles: Array<{ bundleId: string; quantity: number }>,
) => {
  // query linking with backend
  return gql`
  mutation {
    addCheckoutBundles(
      Input: {
        checkoutId: "${checkoutId}",
        userId: "${userId}",
        bundles: ${JSON.stringify(bundles)
          .replace(/"bundleId"/g, 'bundleId')
          .replace(/"quantity"/g, 'quantity')}
      }
    ) {
      ... on CheckoutBundlesType {
        checkoutId
        userId
        bundles {
          checkoutBundleId
          isSelected
          quantity
          bundle {
            id
            name
            description
            slug
            shop {
                id
            }
        }
    }
      }
      ... on ResultError {
          message
          errors
      }
  }
}
  `;
};

export const addCheckoutBundlesQuery = (
  checkoutId: string,
  userId: string,
  bundles: Array<{ bundleId: string; quantity: number }>,
) => {
  return graphqlQueryCheck(
    federationQuery(checkoutId, userId, bundles),
    federationQuery(checkoutId, userId, bundles),
  );
};
