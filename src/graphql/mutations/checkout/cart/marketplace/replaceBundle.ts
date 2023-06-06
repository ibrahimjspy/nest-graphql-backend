import { gql } from 'graphql-request';
import { checkoutBundlesFragment } from 'src/graphql/fragments/checkout/checkoutBundles';
import { ReplaceBundleDto } from 'src/modules/checkout/cart/dto/cart';

export const replaceCheckoutBundleMutation = (
  replaceCheckoutBundleInput: ReplaceBundleDto,
) => {
  const { userEmail, newBundleId, checkoutBundleId } =
    replaceCheckoutBundleInput;
  return gql`
    mutation {
      updateCheckoutBundle(
        input: { userEmail: "${userEmail}", oldCheckoutBundleId: "${checkoutBundleId}", newBundleId: "${newBundleId}" }
      ) {
        ... on CheckoutBundlesType {
          ... CheckoutBundles
        }
      }
    }
    ${checkoutBundlesFragment}
  `;
};
