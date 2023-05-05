import { gql } from 'graphql-request';

export const shopDetailsFragment = gql`
  fragment Shop on Shop {
    id
    name
    email
    url
    madeIn
    minOrder
    description
    about
    returnPolicy
    storePolicy
  }
`;
