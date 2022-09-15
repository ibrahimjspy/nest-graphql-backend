import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/public/graphqlQueryToggle';

const federationQuery = (
  checkoutId: string,
  gatewayId: string,
  token: string,
) => {
  return gql`
  mutation {
    checkoutPaymentCreate(
      id: "${checkoutId}"
      input: {
        gateway: "${gatewayId}",
        token: "${token}"
      }
    ) {
      payment {
        id
        chargeStatus
        metadata {
          key
          value
        }
      }
      paymentErrors {
        field
        message
      }
    }
  }
  `;
};

export const checkoutPaymentCreateQuery = (
  checkoutId: string,
  gatewayId: string,
  token: string,
) => {
  return graphqlQueryCheck(
    federationQuery(checkoutId, gatewayId, token),
    federationQuery(checkoutId, gatewayId, token),
  );
};
