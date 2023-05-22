import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { validatePageFilter } from 'src/graphql/utils/pagination';

const b2cQuery = ({ categoryIds, ...filter }): string => {
  return gql`
  query {
    categories(
      ${validatePageFilter(filter)}
      filter: {
        ids: ${JSON.stringify(categoryIds)}
      }
    ) {
      edges {
        node {
          name
          id
          slug
          children(${validatePageFilter(filter)}) {
            edges {
              node {
                name
                id
                slug
                children(${validatePageFilter(filter)}) {
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

export const categoriesQuery = (filter, isb2c = false) => {
  return graphqlQueryCheck(b2bQuery(filter), b2cQuery(filter), isb2c);
};
