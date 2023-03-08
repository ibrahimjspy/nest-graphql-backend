import { gql } from 'graphql-request';

export const checkoutPromoCodeAddMutation = (
  checkoutId: string,
  promoCode: string,
) => {
  return gql`
    mutation {
      checkoutAddPromoCode(id: "${checkoutId}", promoCode: "${promoCode}") {
        errors {
          message
        }
        checkout {
          id
          totalPrice {
            gross {
              amount
            }
          }
        }
      }
    }
  `;
};
