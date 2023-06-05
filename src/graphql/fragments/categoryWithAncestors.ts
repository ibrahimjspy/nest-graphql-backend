import { gql } from 'graphql-request';

export const categoryWithAncestors = gql`
  fragment CategoryWithAncestors on Category {
    id
    name
    slug
    level
    products {
      totalCount
    }
    ancestors(first: 10) {
      edges {
        node {
          id
          name
          slug
          products {
            totalCount
          }
          level
        }
      }
    }
  }
`;
