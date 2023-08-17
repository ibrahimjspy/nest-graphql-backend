import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const federationQuery = (checkoutId: string) => {
  return gql`
    query {
      checkout(
          id: "${checkoutId}",
      ) {
        id
        metadata {
          key 
          value
        }
        totalPrice {
          gross {
            amount
          }
        }
        discount {
          amount
        }
        voucherCode
        shippingMethods {
          id,
          name,
          active,
          price {
            amount,
            currency
          }
          }
          deliveryMethod {
            ... on ShippingMethod {
            __typename,
            id
            name
            metadata {
              key
              value
            }
            }
            ... on Warehouse {
            __typename,
            id,
            name
            }
          }
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
