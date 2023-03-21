import { gql } from 'graphql-request';

export const storePaymentIntentMutation = (
  checkoutId: string,
  paymentIntentId: string,
  paymentMethodId: string,
) => {
  return gql`
    mutation {
      updateMetadata(
        id: "${checkoutId}"
        input: [{ key: "paymentIntentId", value: "${paymentIntentId}" }, { key: "paymentMethodId", value: "${paymentMethodId}" }]
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
