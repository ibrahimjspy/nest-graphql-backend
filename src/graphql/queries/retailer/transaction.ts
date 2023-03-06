import { gql } from 'graphql-request';

export const getTransactionHistoryQuery = (
  shopId: string,
  fromDate: string,
  toDate: string,
) => {
  const _fromDate = fromDate ? `"${fromDate}"` : null;
  const _toDate = toDate ? `"${toDate}"` : null;
  return gql`
    query {
      transactionHistory(shopId: "${shopId}" fromDate: ${_fromDate} toDate: ${_toDate}) {
        date
        amount
        transactionId
      }
    }
  `;
};
