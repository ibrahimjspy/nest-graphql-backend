import { gql } from 'graphql-request';
import { mediaFragment } from './media';
import { metadataFragment } from './attributes';

export const productDetailsFragment = gql`
  fragment Product on Product {
    id
    description
    name
    slug
    metadata {
      ...Metadata
    }
  }
  ${metadataFragment}
`;

export const checkoutProductDetailsFragment = gql`
  fragment CheckoutProductDetails on Product {
    id
    slug
    name
    media {
      ...Media
    }
  }
  ${mediaFragment}
`;
