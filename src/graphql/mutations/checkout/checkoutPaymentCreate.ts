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
      errors {
        field
        message
			  code
      }
    }
  }
  `;
};

export const checkoutPaymentCreateMutation = (
  checkoutId: string,
  gatewayId: string,
  token: string,
) => {
  return graphqlQueryCheck(
    federationQuery(checkoutId, gatewayId, token),
    federationQuery(checkoutId, gatewayId, token),
  );
};
