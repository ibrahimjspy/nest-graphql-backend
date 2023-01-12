import { gql } from 'graphql-request';

export const shopBankDetailsMutation = (shopId: string, accountId: string) => {
  return gql`
  mutation{
    createShopAccountDetails(
      input: {
        accountId: "${accountId}"
        shopId: "${shopId}"
      }
    )
    {
      accReferId
    }
  }
  `;
};
