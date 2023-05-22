import { gql } from 'graphql-request';

export const categoryFragment = gql`
  fragment Category on Category {
    id
    name
  }
`;
