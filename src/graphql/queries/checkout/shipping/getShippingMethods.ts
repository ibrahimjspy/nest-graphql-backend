import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const b2bQuery = (checkoutId: string): string => {
  return gql`
    query {
      checkout(id: "${checkoutId}") {
        id
        shippingMethods {
          id
          name
          description
          maximumDeliveryDays
          minimumDeliveryDays
        }
      }
    }
  `;
};

const b2cQuery = b2bQuery;
export const getCheckoutShippingMethodsQuery = (
  checkoutId: string,
  isB2C = false,
) => {
  return graphqlQueryCheck(b2bQuery(checkoutId), b2cQuery(checkoutId), isB2C);
};
