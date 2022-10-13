import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/public/graphqlQueryToggle';

const federationQuery = (checkoutId: string) => {
  return gql`
    mutation {
      checkoutComplete (
      id: "${checkoutId}",
      ) {
      order {
        id
        lines {
        id,
        quantity
        }
      }
      errors {
        message
      }
      }
    }
  `;
};

export const checkoutCompleteMutation = (checkoutId: string) => {
  return graphqlQueryCheck(
    federationQuery(checkoutId),
    federationQuery(checkoutId),
  );
};
