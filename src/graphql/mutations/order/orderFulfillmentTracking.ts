import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { FulfillmentUpdateTrackingDto } from 'src/modules/orders/dto/fulfill';

const b2cMutation = (
  fulfillmentUpdateTrackingInput: FulfillmentUpdateTrackingDto,
) => {
  const { fulfillmentId, trackingNumber } = fulfillmentUpdateTrackingInput;
  return gql`
    mutation {
      orderFulfillmentUpdateTracking(
        id: "${fulfillmentId}"
        input: { trackingNumber: "${trackingNumber}" }
      ) {
        fulfillment {
          trackingNumber
          id
          fulfillmentOrder
        }
      }
    }
  `;
};

const b2bMutation = b2cMutation;

export const orderFulfillmentTrackingMutation = (
  fulfillmentUpdateTrackingInput: FulfillmentUpdateTrackingDto,
  isb2c = false,
) => {
  return graphqlQueryCheck(
    b2bMutation(fulfillmentUpdateTrackingInput),
    b2cMutation(fulfillmentUpdateTrackingInput),
    isb2c,
  );
};
