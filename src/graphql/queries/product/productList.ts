import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/public/graphqlQueryToggle';

const federationQuery = () => {
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
const mockQuery = () => {
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
export const productListPageQuery = () => {
  return graphqlQueryCheck(federationQuery(), mockQuery());
};
