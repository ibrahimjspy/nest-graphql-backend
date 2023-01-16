import { gql } from 'graphql-request';

export const getStoreInfoQuery = (shopId: string) => {
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
        values
      }
    }
  }
  `;
};
