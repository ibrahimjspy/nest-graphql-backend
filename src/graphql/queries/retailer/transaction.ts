import { gql } from 'graphql-request';

export const getTransactionHistoryQuery = (shopId: string) => {
  return gql`
    query {
      transactionHistory(
        shopId: "${shopId}"
        fromDate: "2022-12-20"
        toDate: "2022-12-30"
      ) {
        date
        amount
        transactionId
      }
    }
  `;
};
