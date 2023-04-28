import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { shippingMethodFragment } from './fragmants/shippingMethod';

const b2bQuery = (checkoutId: string): string => {
  return gql`
    query {
      checkout(id: "${checkoutId}") {
        id
        shippingMethods {
          ... on ShippingMethod
        }
      }
    }
    ${shippingMethodFragment}
  `;
};

const b2cQuery = b2bQuery;
export const getCheckoutShippingMethodsQuery = (
  checkoutId: string,
  isB2C = false,
) => {
  return graphqlQueryCheck(b2bQuery(checkoutId), b2cQuery(checkoutId), isB2C);
};
