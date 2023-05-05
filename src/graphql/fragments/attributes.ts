import { gql } from 'graphql-request';

export const attributeFragment = gql`
  fragment Attribute on Attribute {
    attribute {
      name
    }
    values {
      name
    }
  }
`;
