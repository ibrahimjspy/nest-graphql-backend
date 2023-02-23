import { gql } from 'graphql-request';

export const savePaymentInfoMutation = ({
  checkoutId,
  userEmail,
  amount,
  paymentStatus,
  intentId,
}) => {
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
