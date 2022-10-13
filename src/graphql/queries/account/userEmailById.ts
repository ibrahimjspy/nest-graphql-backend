import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/public/graphqlQueryToggle';

const federationQuery = (userId: string) => {
  return gql`
    query {
      user (
        id: "${userId}"
      ) {
        id
        email
      }
    }
  `;
};

export const userEmailByIdQuery = (userId: string) => {
  return graphqlQueryCheck(federationQuery(userId), federationQuery(userId));
};
