import { gql } from 'graphql-request';
import { DEFAULT_CHANNEL } from 'src/constants';
import { graphqlQueryCheck } from 'src/public/graphqlQueryToggle';

const federationQuery = (
  email: string,
  bundles: Array<{ quantity: number; variantId: string }>,
) => {
  return gql`
    mutation {
      checkoutCreate(
        input: {
          email: "${email}"
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

export const createCheckoutMutation = (
  email: string,
  bundles: Array<{ quantity: number; variantId: string }>,
) => {
  return graphqlQueryCheck(
    federationQuery(email, bundles),
    federationQuery(email, bundles),
  );
};
