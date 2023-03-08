import { gql } from 'graphql-request';

export const storePaymentIntentMutation = (
  checkoutId: string,
  paymentIntentId: string,
) => {
  return gql`
    mutation {
      updateMetadata(
        id: "${checkoutId}"
        input: [{ key: "paymentIntentId", value: "${paymentIntentId}" }]
      ) {
        item {
          metadata {
            key
            value
          }
        }
      }
    }
  `;
};
