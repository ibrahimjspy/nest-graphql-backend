import { gql } from 'graphql-request';

export const attributeFragment = gql`
  fragment Attribute on SelectedAttribute {
    attribute {
      name
      slug
    }
    values {
      slug
      name
      boolean
    }
  }
`;

export const metadataFragment = gql`
  fragment Metadata on MetadataItem {
    key
    value
  }
`;
