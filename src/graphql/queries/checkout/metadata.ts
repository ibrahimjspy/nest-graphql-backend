import { gql } from 'graphql-request';

export const getCheckoutMetadataQuery = (checkoutId: string): string => {
  return gql`
    query {
      checkout(
        id: "${checkoutId}"
      ) {
        metadata {
          key
          value
        }
      }
    }
  `;
};
