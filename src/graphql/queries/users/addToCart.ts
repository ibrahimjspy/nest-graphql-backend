import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/public/graphqlQueryToggle';

const federationQuery = (userId: string): string => {
  return gql`
  query {
    getCheckout(
      Input: {
        userId: "${userId}VXNlcjoyMDU5ODA1MTg0"
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
