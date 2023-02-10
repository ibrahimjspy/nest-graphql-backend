import { gql } from 'graphql-request';
import { DEFAULT_WAREHOUSE_ID } from 'src/constants';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const b2bMutation = (fulfillmentId: string, warehouseId: string) => {
  const validateWarehouseId = warehouseId || DEFAULT_WAREHOUSE_ID;
  return gql`
    mutation {
      orderFulfillmentCancel(id: "${fulfillmentId}", input: { warehouseId: "${validateWarehouseId}" }) {
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

const b2cMutation = b2bMutation;

export const orderFulfillmentCancelMutation = (
  fulfillmentId: string,
  warehouseId: string,
  isb2c = false,
) => {
  return graphqlQueryCheck(
    b2bMutation(fulfillmentId, warehouseId),
    b2cMutation(fulfillmentId, warehouseId),
    isb2c,
  );
};
