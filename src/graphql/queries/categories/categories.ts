import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const b2cQuery = (categoryIds: string[]): string => {
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

const b2bQuery = b2cQuery;

export const categoriesQuery = (categoryIds: string[], isb2c = false) => {
  return graphqlQueryCheck(b2bQuery(categoryIds), b2cQuery(categoryIds), isb2c);
};
