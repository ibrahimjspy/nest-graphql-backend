import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const federationQuery = () => {
  return gql`
    query {
      me {
        id
        firstName
        lastName
        email
      }
    }
  `;
};

export const UserInformationQuery = () => {
  return graphqlQueryCheck(federationQuery(), federationQuery(), 'false');
};
