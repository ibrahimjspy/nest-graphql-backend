import { gql } from 'graphql-request';

export const addOrderToShopMutation = (
  { shopId, orderId, shippingMethodId, orderlineIds },
  orderBundles,
): string => {
  return gql`
    mutation {
      addOrderToShop(
        input: {
          shopId:"${shopId}"
          orderId:"${orderId}"
          shippingMethodId:"${shippingMethodId}"
          marketplaceOrderBundles: ${orderBundles || null}
          orderlineIds: ${JSON.stringify(orderlineIds) || null} 
        }
      ) {
        orders{
          orderId
        }
      }
    }
  `;
};
