import { gql } from 'graphql-request';

export const getPurchaseHistoryQuery = (shopId: string) => {
  return gql`
  query {
    marketplaceShop (filter: {id: ${shopId}}) {
      name
      description
      about
      url
      fields {
        id
        name
        value
      }
    }
  }
  `;
};
