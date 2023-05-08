import { gql } from 'graphql-request';

export const resultErrorFragment = gql`
  fragment ResultError on ResultError {
    errors
    message
  }
`;
