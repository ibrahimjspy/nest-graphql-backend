import { gql } from 'graphql-request';

export const getSalesReportQuery = (
  shopId: string,
  fromDate: string,
  toDate: string,
) => {
  const _fromDate = fromDate?`"${fromDate}"`:null
  const _toDate = toDate?`"${toDate}"`:null
  return gql`
    query {
      salesReport(shopId: "${shopId}"
        fromDate: ${_fromDate}
        toDate: ${_toDate}
      ) {
        id
        totalPayouts {
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
    }
  `;
};
