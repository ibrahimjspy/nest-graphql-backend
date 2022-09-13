import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/public/graphqlQueryToggle';

const federationQuery = (checkoutId: string) => {
  // query linking with backend
  return gql`
  query {
    checkout(
        id: "${checkoutId}",
    ) {
      id
      lines {
        id
        quantity
        variant {
          id
        }
      }
    }
  }
  `;
};

export const checkoutQuery = (checkoutId: string) => {
  return graphqlQueryCheck(
    federationQuery(checkoutId),
    federationQuery(checkoutId),
  );
};
