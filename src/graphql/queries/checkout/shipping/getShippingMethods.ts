import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { shippingMethodFragment } from '../../../fragments/checkout/shipping/shippingMethod';

const checkoutWithShippingFragment = gql`
  fragment Checkout on Checkout {
    id
    shippingMethods {
      ...ShippingMethod
    }
  }
  ${shippingMethodFragment}
`;

const b2bQuery = (checkoutId: string): string => {
  return gql`
    query Checkout {
      checkout(
        id: "${checkoutId}"
      ) {
        ...Checkout
      }
    }
   ${checkoutWithShippingFragment}
  `;
};

const b2cQuery = b2bQuery;
export const getCheckoutShippingMethodsQuery = (
  checkoutId: string,
  isB2C = false,
) => {
  return graphqlQueryCheck(b2bQuery(checkoutId), b2cQuery(checkoutId), isB2C);
};
