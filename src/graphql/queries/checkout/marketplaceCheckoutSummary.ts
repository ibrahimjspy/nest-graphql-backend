import { gql } from 'graphql-request';

export const marketplaceCheckoutSummaryQuery = (checkoutId: string): string => {
  return gql`
    query {
      checkoutBundles(Filter: { checkoutId: "${checkoutId}" }) {
        ... on CheckoutBundlesType {
          checkoutIds
          totalAmount
          subTotal
          discounts
          taxes
        }
      }
    }
  `;
};
