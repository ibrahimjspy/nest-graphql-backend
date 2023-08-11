import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { CheckoutLinesInterface } from 'src/modules/checkout/cart/services/saleor/Cart.saleor.types';

const b2bQuery = (checkoutId: string, lines: CheckoutLinesInterface) => {
  return gql`
      mutation {
        checkoutLinesUpdate (
          checkoutId: "${checkoutId}", 
          lines: ${JSON.stringify(lines)
            .replace(/"variantId"/g, 'variantId')
            .replace(/"lineId"/g, 'lineId')
            .replace(/"id"/g, 'lineId')
            .replace(/"quantity"/g, 'quantity')}
        ) {
          checkout {
            id
            user {
              email
            }
          }
          errors {
            message
            code
          }
        }
      }
    `;
};

const b2cQuery = b2bQuery;
export const checkoutLinesUpdateMutation = (
  checkoutId: string,
  lines: CheckoutLinesInterface,
) => {
  return graphqlQueryCheck(
    b2bQuery(checkoutId, lines),
    b2cQuery(checkoutId, lines),
  );
};
