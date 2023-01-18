import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { OrderRefundInputInterface } from 'src/graphql/types/order.type';

const b2bMutation = (refundInput: OrderRefundInputInterface) => {
  return gql`
    mutation {
      orderFulfillmentRefundProducts(
        order: "${refundInput.orderId}"
        input: { orderLines: ${refundInput.orderLines
          .replace(/"quantity"/g, 'quantity')
          .replace(
            /"orderLineId"/g,
            'orderLineId',
          )}, fulfillmentLines: ${refundInput.fulfillmentLines
    .replace(/"quantity"/g, 'quantity')
    .replace(/"fulfillmentLineId"/g, 'fulfillmentLineId')}, 
        amountToRefund: ${refundInput.amountToRefund} }
      ) {
        order {
          id
        }
        fulfillment {
          id
        }
        errors {
          field
          message
          orderLines
        }
      }
    }
  `;
};

const b2cMutation = (refundInput: OrderRefundInputInterface) => {
  return gql`
    mutation {
      orderFulfillmentRefundProducts(
        order: "${refundInput.orderId}"
        input: { orderLines: ${refundInput.orderLines
          .replace(/"quantity"/g, 'quantity')
          .replace(
            /"orderLineId"/g,
            'orderLineId',
          )}, fulfillmentLines: ${refundInput.fulfillmentLines
    .replace(/"quantity"/g, 'quantity')
    .replace(/"fulfillmentLineId"/g, 'fulfillmentLineId')}, 
        amountToRefund: ${refundInput.amountToRefund} }
      ) {
        order {
          id
        }
        fulfillment {
          id
        }
        errors {
          field
          message
          orderLines
        }
      }
    }
  `;
};

export const orderRefundMutation = (
  refundInput: OrderRefundInputInterface,
  isb2c = '',
) => {
  return graphqlQueryCheck(
    b2bMutation(refundInput),
    b2cMutation(refundInput),
    isb2c,
  );
};
