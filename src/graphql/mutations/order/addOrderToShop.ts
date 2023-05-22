import { gql } from 'graphql-request';

export const addOrderToShopMutation = (
  userEmail,
  { shopId, orderId, shippingMethodId, orderlineIds },
  orderBundles,
): string => {
  return gql`
    mutation {
      addOrderToShop(
        input: {
          email: "${userEmail}"
          shopId:"${shopId}"
          orderId:"${orderId}"
          shippingMethodId:"${shippingMethodId}"
          marketplaceOrderBundles: ${orderBundles || null}
          orderlineIds: ${JSON.stringify(orderlineIds) || null} 
        }
      ) {
        id
      }
    }
  `;
};
