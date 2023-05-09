import { gql } from 'graphql-request';

export const productDetailsFragment = gql`
  fragment Product on Product {
    id
    description
    name
    slug
  }
`;
