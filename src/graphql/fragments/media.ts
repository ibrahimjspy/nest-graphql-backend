import { gql } from 'graphql-request';

export const mediaFragment = gql`
  fragment Media on ProductMedia {
    url
  }
`;
