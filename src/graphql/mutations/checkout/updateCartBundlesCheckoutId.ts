import { gql } from 'graphql-request';
import { graphqlObjectTransform } from 'src/core/utils/helpers';
import { resultErrorFragment } from 'src/graphql/fragments/errors';
import { UpdateMarketplaceCheckoutIdType } from 'src/modules/checkout/cart/Cart.types';

export const updateCartBundlesCheckoutIdMutation = (
  email: string,
  updateMarketplaceCheckoutIdInput: UpdateMarketplaceCheckoutIdType[],
) => {
  return gql`
    mutation MyMutation {
      updateUserCartBundlesCheckoutId(
        input: { checkoutBundles: ${graphqlObjectTransform(
          updateMarketplaceCheckoutIdInput,
        )}, userEmail: "${email}" }
      ) {
        ... on CheckoutBundlesType {
          userEmail
          checkoutIds
          checkoutBundles{
            checkoutBundleId
            checkoutId
            bundle {
              id
            }
          }
        }
        ... on ResultError {
          ... ResultError
        }
      }
    }
    ${resultErrorFragment}
  `;
};
