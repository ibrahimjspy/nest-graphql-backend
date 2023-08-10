import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { checkoutShippingMethodFragment } from '../../../fragments/checkout/shipping/shippingMethod';

const checkoutShippingMethodsFragment = gql`
  fragment Checkout on Checkout {
    id
    deliveryMethod {
      ... on ShippingMethod {
        id
        metadata {
          key
          value
        }
      }
      ... on Warehouse {
        __typename
        id
        name
      }
    }
    shippingMethods {
      ...ShippingMethod
    }
  }
  ${checkoutShippingMethodFragment}
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
   ${checkoutShippingMethodsFragment}
  `;
};

const b2cQuery = b2bQuery;
export const getCheckoutShippingMethodsQuery = (
  checkoutId: string,
  isB2C = false,
) => {
  return graphqlQueryCheck(b2bQuery(checkoutId), b2cQuery(checkoutId), isB2C);
};
