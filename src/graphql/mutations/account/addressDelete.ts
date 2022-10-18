import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const federationQuery = (addressId: string) => {
  return gql`
    mutation {
      addressDelete(id: "${addressId}") {
        errors {
          code
          field
          message
        }
      }
    }
  `;
};

export const addressDeleteMutation = (addressId: string) => {
  return graphqlQueryCheck(
    federationQuery(addressId),
    federationQuery(addressId),
  );
};
