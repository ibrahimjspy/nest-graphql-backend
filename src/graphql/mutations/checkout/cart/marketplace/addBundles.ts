import { gql } from 'graphql-request';
import { checkoutBundleLineFragment } from 'src/graphql/fragments/checkout/cart';
import { checkoutShopFragment } from 'src/graphql/fragments/checkout/shops';
import { addCheckoutBundlesTransformer } from 'src/graphql/utils/checkout';
import { AddBundleDto } from 'src/modules/checkout/dto';

export const addCheckoutBundlesV2Mutation = (checkoutBundles: AddBundleDto) => {
  const { userEmail, checkoutId, bundles } = checkoutBundles;
  const addBundlesInput = `{
    userEmail: "${userEmail}"
    cartId: "${checkoutId}"
    bundles: ${addCheckoutBundlesTransformer(bundles)}
  }`;
  return gql`
    mutation {
      addBundlesToCart(input: ${addBundlesInput}) {
        ... on CartType {
          ...CartDetails
          shops {
            ...CartShops
          }
        }
      }
    }
    ${checkoutBundleLineFragment}
    ${checkoutShopFragment}
  `;
};
