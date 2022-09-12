import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/public/graphqlQueryToggle';

const federationQuery = (checkoutId: string, linedIds: Array<string>) => {
  // query linking with backend
  return gql`
  mutation {
    CheckoutLinesUpdate (checkoutId: "${checkoutId}", linesIds: ${JSON.stringify(
    linedIds,
  )}) {
      checkout {
        id
      }
      checkoutErrors {
        code
        message
      }
      errors {
        message
        code
      }
    }
  }
  `;
};

export const checkoutLinesUpdateQuery = (
  checkoutId: string,
  linedIds: Array<string>,
) => {
  return graphqlQueryCheck(
    federationQuery(checkoutId, linedIds),
    federationQuery(checkoutId, linedIds),
  );
};
