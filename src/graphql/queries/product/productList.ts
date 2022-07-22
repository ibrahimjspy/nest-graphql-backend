import { gql } from 'graphql-request';

export const productListPageQuery = () => {
  return gql`
    query {
      category(slug: "accessories") {
        products(first: 20, channel: "default-channel") {
          edges {
            node {
              name
              id
              slug
            }
          }
        }
        name
        id
        slug
        children(first: 10) {
          edges {
            node {
              name
              id
              slug
            }
          }
        }
      }
    }
  `;
};
