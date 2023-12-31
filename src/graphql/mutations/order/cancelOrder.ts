import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const b2bMutation = (orderId: string) => {
  return gql`
    mutation {
      orderCancel(id: "${orderId}") {
        order {
          id
          status
          fulfillments {
            id
          }
        }
        errors {
          field
          message
        }
      }
    }
  `;
};

const b2cMutation = b2bMutation;

export const orderCancelMutation = (orderId: string, isb2c = false) => {
  return graphqlQueryCheck(b2bMutation(orderId), b2cMutation(orderId), isb2c);
};
