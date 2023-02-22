import { gql } from 'graphql-request';

export const checkoutDeliveryMethodUpdateMutation = (
  checkoutId: string,
  deliveryMethodId: string,
) => {
  return gql`
    mutation {
      checkoutDeliveryMethodUpdate(
      deliveryMethodId: "${deliveryMethodId}",
        id: "${checkoutId}"
      ) {
        checkout {
          id
        }
        errors {
          message
        }
      }
    }
  `;
};
