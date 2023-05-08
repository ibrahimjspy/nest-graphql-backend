import { gql } from 'graphql-request';

export const bundleDetailsFragment = gql`
  fragment Bundle on BundleViewType {
    id
    name
    description
    slug
  }
`;
