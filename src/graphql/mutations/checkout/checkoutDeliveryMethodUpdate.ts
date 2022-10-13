import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

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

export const checkoutDeliveryMethodUpdateMutation = (
  checkoutId: string,
  deliveryMethodId: string,
) => {
  return graphqlQueryCheck(
    federationQuery(checkoutId, deliveryMethodId),
    federationQuery(checkoutId, deliveryMethodId),
  );
};
