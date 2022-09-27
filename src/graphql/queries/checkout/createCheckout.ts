import { gql } from 'graphql-request';
import { DEFAULT_CHANNEL } from 'src/constants';
import { graphqlQueryCheck } from 'src/public/graphqlQueryToggle';

const federationQuery = (
  bundles: Array<{ quantity: number; variantId: string }>,
) => {
  return gql`
    mutation {
      checkoutCreate(
        input: {
          channel: "${DEFAULT_CHANNEL}"
          lines: ${JSON.stringify(bundles)
            .replace(/"quantity"/g, 'quantity')
            .replace(/"variantId"/g, 'variantId')}
        }
      ) {
        checkout {
          id
        }
      }
    }
  `;
};

export const createCheckoutQuery = (
  bundles: Array<{ quantity: number; variantId: string }>,
) => {
  return graphqlQueryCheck(federationQuery(bundles), federationQuery(bundles));
};
