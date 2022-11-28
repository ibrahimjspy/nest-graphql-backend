import { gql } from 'graphql-request';

export const addOrderToShopMutation = (
  { shopId, orderId, shippingMethodId },
  orderBundles,
): string => {
  return gql`
    mutation{
        addOrderToShop(input:{
        shopId:"${shopId}"
        orderId:"${orderId}"
        shippingMethodId:"${shippingMethodId}"
        marketplaceOrderBundles: [${orderBundles}]
        }){
        orders{
            orderId
        }
        }}
  `;
};
