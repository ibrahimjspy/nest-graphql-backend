import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const b2bQuery = (categoryIds: string[]): string => {
  return gql`
  query {
    categories(
        first: 20, 
        filter: {
          ids: ${JSON.stringify(categoryIds)}
        }
    ) {
      edges {
        node {
          name
          id
          slug
          children(first: 20) {
            edges {
              node {
                name
                id
                slug
                children(first: 20) {
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
          }
        }
      }
    }
  }`;
};

const b2cQuery = b2bQuery;

export const categoriesQuery = (categoryIds: string[], isb2c = false) => {
  return graphqlQueryCheck(b2bQuery(categoryIds), b2cQuery(categoryIds), isb2c);
};
