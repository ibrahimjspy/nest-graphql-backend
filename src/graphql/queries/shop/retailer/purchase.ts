import { gql } from 'graphql-request';

export const getPurchaseHistoryQuery = (
  shopId: string,
  fromDate: string,
  toDate: string,
) => {
  const _fromDate = fromDate ? `"${fromDate}"` : null;
  const _toDate = toDate ? `"${toDate}"` : null;
  return gql`
  query {
    purchaseHistory(shopId: "${shopId}" fromDate: ${_fromDate} toDate: ${_toDate}){
      profit
      productName
      sold
     }
   }
  `;
};
