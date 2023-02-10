import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const b2bMutation = (orderId: string, orderLines: string) => {
  return gql`
    mutation {
      orderFulfill(
        order: "${orderId}"
        input: {
          lines: ${orderLines}
        }
      ) {
        order {
          id
        }
        fulfillments {
          id
        }
        errors {
          field
          message
          code
        }
      }
    }
  `;
};

const b2cMutation = b2bMutation;

export const orderFulfillMutation = (
  orderId: string,
  orderLines: string,
  isb2c = false,
) => {
  return graphqlQueryCheck(
    b2bMutation(orderId, orderLines),
    b2cMutation(orderId, orderLines),
    isb2c,
  );
};
