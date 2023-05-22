import { gql } from 'graphql-request';
import { mediaFragment } from './media';

export const productDetailsFragment = gql`
  fragment Product on Product {
    id
    description
    name
    slug
  }
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
