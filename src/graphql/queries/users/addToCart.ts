import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/public/graphqlQueryToggle';

const federationQuery = (userId: string): string => {
  return gql`
  query {
    marketplaceCheckout(
      Input: {
        userId: "${userId}"
      }
    ) {
      bundles {
        bundle {
          id
          shop {
            id
          }
        }
        isSelected
      }
      checkoutId
      userId
    }
  }
  `;
};

export const addToCartQuery = (userId: string) => {
  return graphqlQueryCheck(federationQuery(userId), federationQuery(userId));
};
