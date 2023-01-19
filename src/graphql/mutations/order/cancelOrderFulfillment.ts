import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const b2bMutation = (fulfillmentId: string, warehouseId: string) => {
  return gql`
    mutation {
      orderFulfillmentCancel(id: "${fulfillmentId}", input: { warehouseId: "${warehouseId}" }) {
        fulfillment {
          id
          status
        }
        order {
          status
        }
        errors {
          message
          field
        }
      }
    }
  `;
};

const b2cMutation = (fulfillmentId: string, warehouseId: string) => {
  return gql`
    mutation {
      orderFulfillmentCancel(id: "${fulfillmentId}", input: { warehouseId: "${warehouseId}" }) {
        fulfillment {
          id
          status
        }
        order {
          status
        }
        errors {
          message
          field
        }
      }
    }
  `;
};

export const orderFulfillmentCancelMutation = (
  fulfillmentId: string,
  warehouseId: string,
  isb2c = '',
) => {
  return graphqlQueryCheck(
    b2bMutation(fulfillmentId, warehouseId),
    b2cMutation(fulfillmentId, warehouseId),
    isb2c,
  );
};
