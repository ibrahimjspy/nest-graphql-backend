import { gql } from 'graphql-request';

export const attributeFragment = gql`
  fragment Attribute on SelectedAttribute {
    attribute {
      name
    }
    values {
      name
    }
  }
`;

export const metadataFragment = gql`
  fragment Metadata on MetadataItem {
    key
    value
  }
`;
