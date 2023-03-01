import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const b2bMutation = (productIds: string[], shopId: string) => {
  return gql`
    mutation {
      deleteProductsFromShop(Input: { productIds: ${JSON.stringify(
        productIds,
      )}, shopId: "${shopId}" }) {
        message
      }
    }
  `;
};
const b2cMutation = b2bMutation;
export const removeProductsFromShopMutation = (
  productIds: string[],
  shopId: string,
  isb2c = false,
) => {
  return graphqlQueryCheck(
    b2bMutation(productIds, shopId),
    b2cMutation(productIds, shopId),
    isb2c,
  );
};
