import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/public/graphqlQueryToggle';

const federationQuery = (checkoutId: string, deliveryMethodId: string) => {
  return gql`
  mutation {
    checkoutDeliveryMethodUpdate(
     deliveryMethodId: "${deliveryMethodId}",
       id: "${checkoutId}"
     ) {
       checkout {
         id
       }
       errors {
         message
       }
     }
   }
  `;
};

export const checkoutDeliveryMethodUpdateQuery = (
  checkoutId: string,
  deliveryMethodId: string,
) => {
  return graphqlQueryCheck(
    federationQuery(checkoutId, deliveryMethodId),
    federationQuery(checkoutId, deliveryMethodId),
  );
};
