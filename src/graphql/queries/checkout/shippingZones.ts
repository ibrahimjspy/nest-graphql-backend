import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const federationQuery = () => {
  return gql`
    query {
      shippingZones(first: 10) {
        edges {
          node {
            id
            shippingMethods {
              id
              name
            }
          }
        }
      }
    }
  `;
};

export const shippingZonesQuery = () => {
  return graphqlQueryCheck(federationQuery(), federationQuery());
};
