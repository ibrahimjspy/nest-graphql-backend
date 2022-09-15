import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/public/graphqlQueryToggle';

const federationQuery = (
  checkoutId: string,
  shopShippingMethodIds: Array<string>,
) => {
  return gql`
  mutation {
    addCheckoutShippingMethods(
      Input: {
       checkoutId: "${checkoutId}",
       shopShippingMethodIds: ${JSON.stringify(shopShippingMethodIds)}
      }
     ) {
         __typename
         ... on CheckoutBundlesType {
           selectedMethods {
             checkoutShippingMethodId
             method {
               id
               shippingMethodId
             }
           }
         }
       ... on ResultError {
         errors
         message
       }
     }
   }
  `;
};

export const addCheckoutShippingMethodsQuery = (
  checkoutId: string,
  shopShippingMethodIds: Array<string>,
) => {
  return graphqlQueryCheck(
    federationQuery(checkoutId, shopShippingMethodIds),
    federationQuery(checkoutId, shopShippingMethodIds),
  );
};
