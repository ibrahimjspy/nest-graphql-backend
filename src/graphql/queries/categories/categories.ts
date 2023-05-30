import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { categoryFragment } from 'src/graphql/fragments/category';
import { categoryWithAncestors } from 'src/graphql/fragments/categoryWithAncestors';
import { validatePageFilter } from 'src/graphql/utils/pagination';

const b2bQuery = ({ categoryIds, ...filter }): string => {
  return gql`
  query {
    categories(
      ${validatePageFilter(filter)}
      filter: {
        ids: ${JSON.stringify(categoryIds || [])}
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

const b2cQuery = ({ categoryIds, ...filter }): string => {
  return gql`
  query {
    categories(
      ${validatePageFilter(filter)}
      filter: {
        ids: ${JSON.stringify(categoryIds || [])}
      }
    ) {
      edges {
        node {
          level
          ... CategoryWithAncestors
          children(${validatePageFilter(filter)}) {
            edges {
              node {
                level
                ... Category
                children(${validatePageFilter(filter)}) {
                  edges {
                    node {
                      level
                      ... Category
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  ${categoryFragment}
  ${categoryWithAncestors}`;
};


export const categoriesQuery = (filter, isb2c = false) => {
  return graphqlQueryCheck(b2bQuery(filter), b2cQuery(filter), isb2c);
};
