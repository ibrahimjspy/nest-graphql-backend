import { gql } from 'graphql-request';
import { CheckoutSummaryInputEnum } from 'src/modules/checkout/Checkout.utils.type';

export const marketplaceCheckoutSummaryQuery = (
  user: string,
  type: CheckoutSummaryInputEnum,
): string => {
  const filter =
    type === CheckoutSummaryInputEnum.id
      ? `{ checkoutId: "${user}" }`
      : `{ userEmail: "${user}" }`;
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
