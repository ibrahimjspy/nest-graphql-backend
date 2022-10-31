import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const federationQuery = (): string => {
  return gql`
    query {
      homepageEvents(last: 10) {
        edges {
          node {
            id
            type
            date
            orderNumber
            status
          }
        }
      }
    }
  `;
};

export const orderActivityQuery = () => {
  return graphqlQueryCheck(federationQuery(), federationQuery());
};
