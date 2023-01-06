import { gql } from 'graphql-request';

export const getPurchaseHistoryQuery = (shopId: string) => {
  return gql`
  query {
    purchaseHistory(shopId: "${shopId}" ){
      profit
      productName
      sold
     }
   }
  `;
};
