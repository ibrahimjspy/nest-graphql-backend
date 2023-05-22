import { gql } from 'graphql-request';

export const shopBankDetailsMutation = (shopId: string, accountId: string) => {
  return gql`
    mutation {
      createShopAccountDetails(input: { shopId: "${shopId}", accountId: "${accountId}" }) {
        __typename
        ... on ShopBankAccountType {
          shop
          id
          accReferId
        }
        ... on ResultError {
          message
        }
      }
    }
  `;
};
