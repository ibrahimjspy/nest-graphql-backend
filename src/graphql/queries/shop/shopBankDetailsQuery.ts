import { gql } from 'graphql-request';

export const shopBankDetailsQuery = (shopId: string): string => {
  return gql`
    query {
      shopBankDetails(input: { shopId: "${shopId}" }) {
        ... on ShopBankAccountType {
          id
          shop
          accReferId
        }
        ... on ResultError {
          message
        }
      }
    }
  `;
};
