import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const federationQuery = (checkoutId: string, email: string) => {
  return gql`
    mutation {
      checkoutEmailUpdate (
      id: "${checkoutId}",
      email: "${email}"
      ) {
      checkout {
          id
          email
        }
        errors {
          field
          message
        }
      }
    }
  `;
};

export const checkoutEmailUpdateMutation = (
  checkoutId: string,
  email: string,
) => {
  return graphqlQueryCheck(
    federationQuery(checkoutId, email),
    federationQuery(checkoutId, email),
  );
};
