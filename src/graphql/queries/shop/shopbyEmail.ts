import { gql } from 'graphql-request';

export const ShopByEmailQuery = (Email: string): string => {
  return gql`
  query{
    marketplaceShops(filter:{managers:["${Email}"]}){
      edges{
        node{
          id
          name
          url
          description
          about
          returnPolicy
          fields{
            name
            values
          }
        }
      }
    }
  }
  `;
};
