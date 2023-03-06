import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const b2bMutation = (checkoutId: string, linedIds: Array<string>) => {
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
const b2cMutation = b2bMutation;
export const checkoutLinesDeleteMutation = (
  checkoutId: string,
  linedIds: Array<string>,
) => {
  return graphqlQueryCheck(
    b2bMutation(checkoutId, linedIds),
    b2cMutation(checkoutId, linedIds),
  );
};
