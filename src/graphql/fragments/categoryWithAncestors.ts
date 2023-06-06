import { gql } from 'graphql-request';

export const categoryWithAncestors = gql`
  fragment CategoryWithAncestors on Category {
    id
    name
    slug
    level
    metadata {
      key
      value
    }
    products {
      totalCount
    }
    ancestors(first: 10) {
      edges {
        node {
          id
          name
          metadata {
            key
            value
          }
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
