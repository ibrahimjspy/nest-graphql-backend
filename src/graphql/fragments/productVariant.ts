import { gql } from 'graphql-request';

export const productVariantDetailsFragment = gql`
  fragment ProductVariant on ProductVariant {
    id
    sku
  }
`;
