import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/public/graphqlQueryToggle';

const federationQuery = (
  checkoutId: string,
  bundles: Array<{ quantity: number; variantId: string }>,
) => {
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

export const checkoutLinesAddMutation = (
  checkoutId,
  bundles: Array<{ quantity: number; variantId: string }>,
) => {
  return graphqlQueryCheck(
    federationQuery(checkoutId, bundles),
    federationQuery(checkoutId, bundles),
  );
};
