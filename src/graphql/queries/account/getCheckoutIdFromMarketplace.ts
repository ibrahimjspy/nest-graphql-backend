import { gql } from 'graphql-request';

export const getCheckoutIdFromMarketplaceQuery = (userEmail: string) => {
  return gql`
    query {
      checkoutBundles(Filter: { userEmail: "${userEmail}" }) {
        ... on CheckoutBundlesType {
          checkoutId
        }
      }
    }
  `;
};
