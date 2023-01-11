import { gql } from 'graphql-request';

export const getTransactionHistoryQuery = (
  shopId: string,
  fromDate: string,
  toDate: string,
) => {
  return gql`
    query {
      transactionHistory(shopId: "${shopId}" fromDate: "${fromDate}" toDate: "${toDate}") {
        date
        amount
        transactionId
      }
    }
  `;
};
