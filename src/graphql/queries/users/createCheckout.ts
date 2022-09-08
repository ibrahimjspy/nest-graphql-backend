import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/public/graphqlQueryToggle';

const federationQuery = (
  bundles: Array<{ quantity: number; variantId: string }>,
) => {
  // query linking with backend
  return gql`
    mutation {
      checkoutCreate(
        input: {
          channel: "default-channel"
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
