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

export const checkoutCompleteQuery = (checkoutId: string) => {
  return graphqlQueryCheck(
    federationQuery(checkoutId),
    federationQuery(checkoutId),
  );
};
