import { gql } from 'graphql-request';

export const getUserOrderCountQuery = () => {
  return gql`
    query {
      me {
        id
        orders {
          totalCount
        }
      }
    }
  `;
};
