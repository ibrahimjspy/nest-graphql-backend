import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/public/graphqlQueryToggle';

const federationQuery = (id: string): string => {
  return gql`
  query{
    order(id: "${id}")
    {
      number
      created
      userEmail
    }
  }
  `;
};

// returns shop orders query based on federation and mock check
export const orderDetails = (id: string) => {
  return graphqlQueryCheck(federationQuery(id), federationQuery(id));
};
