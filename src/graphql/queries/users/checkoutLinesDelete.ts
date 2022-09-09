import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/public/graphqlQueryToggle';

const federationQuery = (linedIds: Array<string>) => {
  // query linking with backend
  return gql`
  mutation {
    checkoutLinesDelete (linesIds: ${JSON.stringify(linedIds)}) {
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

export const checkoutLinesDeleteQuery = (linedIds: Array<string>) => {
  return graphqlQueryCheck(
    federationQuery(linedIds),
    federationQuery(linedIds),
  );
};
