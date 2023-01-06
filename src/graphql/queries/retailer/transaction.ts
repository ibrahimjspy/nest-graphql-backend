import { gql } from 'graphql-request';

export const getTransactionHistoryQuery = (shopId: string) => {
  return gql`
    query {
      transactionHistory(shopId: "${shopId}") {
        date
        amount
        transactionId
      }
    }
  `;
};
