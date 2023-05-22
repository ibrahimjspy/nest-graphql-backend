import { gql } from 'graphql-request';

export const pageInfoFragment = gql`
  fragment PageInfo on PageInfo {
    hasNextPage
    hasPreviousPage
    endCursor
    startCursor
  }
`;
