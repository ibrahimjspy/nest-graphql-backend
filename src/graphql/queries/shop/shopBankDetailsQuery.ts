import { gql } from 'graphql-request';
import { resultErrorFragment } from 'src/graphql/fragments/errors';
import { shopBankAccountFragment } from 'src/graphql/fragments/shop';

export const shopBankDetailsQuery = (shopId: string): string => {
  return gql`
    query {
      shopBankDetails(input: { shopId: "${shopId}" }) {
        ... on ShopBankAccountType {
         ...ShopBankAccount
        }
        ... on ResultError {
          ... ResultError
        }
      }
    }
    ${shopBankAccountFragment}
    ${resultErrorFragment}
  `;
};
