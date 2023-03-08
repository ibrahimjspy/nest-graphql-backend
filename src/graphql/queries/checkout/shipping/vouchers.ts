import { gql } from 'graphql-request';

export const getShippingVouchersQuery = (first = 100): string => {
  return gql`
    query {
      vouchers(first: ${first}) {
        edges {
          node {
            id
            code
            channelListings {
              discountValue
              minSpent {
                amount
              }
            }
          }
        }
      }
    }
  `;
};
