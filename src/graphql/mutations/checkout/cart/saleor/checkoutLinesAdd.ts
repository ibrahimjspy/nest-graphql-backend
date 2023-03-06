import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { CheckoutLinesInterface } from 'src/modules/checkout/cart/services/saleor/Cart.saleor.types';

const b2bQuery = (checkoutId: string, bundles: CheckoutLinesInterface) => {
  return gql`
    mutation {
      checkoutLinesAdd(
          checkoutId: "${checkoutId}",
          lines: ${JSON.stringify(bundles)
            .replace(/"variantId"/g, 'variantId')
            .replace(/"quantity"/g, 'quantity')}
      ) {
        checkout {
          id
          lines {
            id
            variant{
              id
            }
          }
        }
        errors {
          code
          field
          message
        }
      }
    }
  `;
};

const b2cQuery = b2bQuery;
export const checkoutLinesAddMutation = (
  checkoutId,
  bundles: CheckoutLinesInterface,
) => {
  return graphqlQueryCheck(
    b2cQuery(checkoutId, bundles),
    b2cQuery(checkoutId, bundles),
  );
};
