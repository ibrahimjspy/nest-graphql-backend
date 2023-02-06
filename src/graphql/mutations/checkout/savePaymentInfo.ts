import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const federationQuery = (
  checkoutId: string,
  userEmail: string,
  amount: number,
  paymentStatus: number,
  intentId: string,
) => {
  return gql`
    mutation {
      paymentInfoMutation(
        Input: {
          checkoutId: "${checkoutId}"
          userEmail: "${userEmail}"
          amount: ${amount}
          paymentStatus: ${paymentStatus}
          intentId: "${intentId}"
        }
      ) {
        ... on CheckoutPaymentInfo {
          intentId
        }
        ... on ResultError {
          __typename
          errors
          message
        }
      }
    }
  `;
};

export const savePaymnetInfoMutation = (
  checkoutId: string,
  userEmail: string,
  amount: number,
  paymentStatus: number,
  intentId: string,
) => {
  return graphqlQueryCheck(
    federationQuery(checkoutId, userEmail, amount, paymentStatus, intentId),
    federationQuery(checkoutId, userEmail, amount, paymentStatus, intentId),
  );
};
