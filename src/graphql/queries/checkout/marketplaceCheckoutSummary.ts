import { gql } from 'graphql-request';

export const marketplaceCheckoutSummaryQuery = (
  user: string,
  type: string,
): string => {
  const filter =
    type == 'id' ? `{ checkoutId: "${user}" }` : `{ userEmail: "${user}" }`;
  return gql`
    query {
      checkoutBundles(Filter: ${filter}) {
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
