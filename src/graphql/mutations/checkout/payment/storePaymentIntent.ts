import { gql } from 'graphql-request';

export const storePaymentIntentMutation = (
  checkoutId: string,
  paymentMethodId: string,
  paymentIntentId?: string,
) => {
  const paymentIntentMetadata = paymentIntentId
    ? `,{ key: "paymentIntentId", value: "${paymentIntentId}" }`
    : '';
  return gql`
    mutation {
      updateMetadata(
        id: "${checkoutId}"
        input: [ { key: "paymentMethodId", value: "${paymentMethodId}" } ${paymentIntentMetadata}]
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
