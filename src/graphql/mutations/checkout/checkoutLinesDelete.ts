import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const federationQuery = (checkoutId: string, linedIds: Array<string>) => {
  return gql`
  mutation {
    checkoutLinesDelete (
      id: "${checkoutId}",
      linesIds: ${JSON.stringify(linedIds)}
    ) {
      checkout {
        id
      }
      errors {
        message
        code
      }
    }
  }
  `;
};

export const checkoutLinesDeleteMutation = (
  checkoutId: string,
  linedIds: Array<string>,
) => {
  return graphqlQueryCheck(
    federationQuery(checkoutId, linedIds),
    federationQuery(checkoutId, linedIds),
  );
};
