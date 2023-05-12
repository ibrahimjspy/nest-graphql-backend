import { gql } from 'graphql-request';
import { isBoolean } from 'src/core/utils/helpers';
import { checkoutBundleLineFragment } from 'src/graphql/fragments/checkout/cart';
import { checkoutShopFragment } from 'src/graphql/fragments/checkout/shops';

export const getCartV2Query = (
  checkoutId: string,
  isSelected: boolean | null,
): string => {
  const isSelectedQuery = isBoolean(isSelected)
    ? `isSelected:${isSelected}`
    : '';
  return gql`
    query {
      getCart(
        cartId: "${checkoutId}"
        ${isSelectedQuery}
      ) {
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
