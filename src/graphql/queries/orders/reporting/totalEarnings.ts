import { gql } from 'graphql-request';

import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const b2bQuery = (storefrontId: string): string => {
  return gql`
    query {
      salesReport(
        shopId: "${storefrontId}"
        Paginate: { first: 12 }
        fromDate: "2020-12-20"
        toDate: "${new Date().toISOString().slice(0, 10)}"
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

const b2cQuery = (storefrontId: string): string => {
  return gql`
    query {
      salesReport(
        shopId: "${storefrontId}"
        Paginate: { first: 12 }
        fromDate: "2020-12-20"
        toDate: "${new Date().toISOString().slice(0, 10)}"
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

export const getTotalEarningsQuery = (storefrontId, isB2C = false) => {
  return graphqlQueryCheck(
    b2bQuery(storefrontId),
    b2cQuery(storefrontId),
    isB2C,
  );
};
