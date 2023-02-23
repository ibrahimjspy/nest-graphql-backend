import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { OrderRefundProductsInput } from 'src/modules/orders/dto/refund';

const b2bMutation = (
  orderId: string,
  refundInput: OrderRefundProductsInput,
) => {
  return gql`
    mutation {
      orderFulfillmentRefundProducts(
        order: "${orderId}"
        input: ${JSON.stringify(refundInput)
          .replace(/"fulfillmentLines"/g, 'fulfillmentLines')
          .replace(/"fulfillmentLineId"/g, 'fulfillmentLineId')
          .replace(/"quantity"/g, 'quantity')
          .replace(/"includeShippingCosts"/g, 'includeShippingCosts')
          .replace(/"amountToRefund"/g, 'amountToRefund')
          .replace(/"orderLines"/g, 'orderLines')
          .replace(/"orderLineId"/g, 'orderLineId')}
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

const b2cMutation = b2bMutation;

export const orderFulfillmentsRefundMutation = (
  orderId: string,
  refundInput: OrderRefundProductsInput,
  isb2c = false,
) => {
  return graphqlQueryCheck(
    b2bMutation(orderId, refundInput),
    b2cMutation(orderId, refundInput),
    isb2c,
  );
};
