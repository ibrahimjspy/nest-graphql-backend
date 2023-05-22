import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const b2bMutation = (orderId: string, refundAmount: number) => {
  return gql`
    mutation {
      orderRefund(amount: ${refundAmount}, id: "${orderId}") {
        order {
          id
          status
          paymentStatus
        }
        errors {
          message
          field
          code
        }
      }
    }
  `;
};

const b2cMutation = b2bMutation;

export const orderAmountRefundMutation = (
  orderId: string,
  refundAmount: number,
  isb2c = false,
) => {
  return graphqlQueryCheck(
    b2bMutation(orderId, refundAmount),
    b2cMutation(orderId, refundAmount),
    isb2c,
  );
};
