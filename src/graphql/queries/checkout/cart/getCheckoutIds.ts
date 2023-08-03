import { gql } from 'graphql-request';

export const getCheckoutIdsQuery = (userEmail: string): string => {
  return gql`
    query {
      checkoutBundles(Filter: { userEmail: "${userEmail}" }) {
        ... on CheckoutBundlesType {
          checkoutIds
        }
      }
    }
  `;
};
