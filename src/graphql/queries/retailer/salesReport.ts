import { gql } from 'graphql-request';

export const getSalesReportQuery = (
  shopId: string,
  fromDate: string,
  toDate: string,
) => {
  return gql`
    query {
      salesReport(shopId: "${shopId}"
        fromDate: "${fromDate}"
        toDate: "${toDate}"
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
