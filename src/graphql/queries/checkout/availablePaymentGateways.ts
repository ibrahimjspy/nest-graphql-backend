import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const federationQuery = (checkoutId: string) => {
  return gql`
  query {
    checkout(id: "${checkoutId}") {
      availablePaymentGateways {
        id
        name
        config {
          field
          value
        }
      }
    }
  }
  `;
};

export const availablePaymentGatewaysQuery = (checkoutId: string) => {
  return graphqlQueryCheck(
    federationQuery(checkoutId),
    federationQuery(checkoutId),
  );
};
