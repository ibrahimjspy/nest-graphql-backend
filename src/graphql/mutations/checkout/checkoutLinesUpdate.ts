import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const federationQuery = (
  checkoutId: string,
  lines: Array<{ variantId: string; quantity: number }>,
) => {
  return gql`
    mutation {
      checkoutLinesUpdate (
        checkoutId: "${checkoutId}", 
        lines: ${JSON.stringify(lines)
          .replace(/"variantId"/g, 'variantId')
          .replace(/"quantity"/g, 'quantity')}
      ) {
        checkout {
          id
        }
        errors {
          message
          code
        }
      }
    }
  `;
};

export const checkoutLinesUpdateMutation = (
  checkoutId: string,
  lines: Array<{ variantId: string; quantity: number }>,
) => {
  return graphqlQueryCheck(
    federationQuery(checkoutId, lines),
    federationQuery(checkoutId, lines),
  );
};
