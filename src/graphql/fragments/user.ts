import { gql } from 'graphql-request';

export const userFragment = gql`
  fragment User on User {
    firstName
    lastName
  }
`;
