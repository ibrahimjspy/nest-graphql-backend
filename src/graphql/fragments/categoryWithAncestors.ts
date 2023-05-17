import { gql } from 'graphql-request';

export const categoryWithAncestors = gql`
  fragment CategoryWithAncestors on Category {
    id
    name
    slug
    ancestors(first: 10) {
      edges {
        node {
          id
          name
          slug
        }
      }
    }
  }
`;
