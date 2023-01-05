import { gql } from 'graphql-request';

export const getSalesReportQuery = (shopId: string) => {
  return gql`
    query {
      salesReport(
        shopId: "${shopId}"
      ) {
        id
        payout {
          formated
          price
          currencyCode
        }
        totalPrice {
          formated
          price
          currencyCode
        }
        pendingPayout {
          formated
          price
          currencyCode
        }
      }
    }
  `;
};
