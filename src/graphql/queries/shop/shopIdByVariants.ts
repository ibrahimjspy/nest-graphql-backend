import { gql } from 'graphql-request';

export const shopIdByVariantIdQuery = (variantId: string): string => {
  return gql`
    query {
      marketplaceShop(
        filter: { productVariant: "${variantId}" }
      ) {
        id
        name
      }
    }
  `;
};
