import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { categoryFragment } from 'src/graphql/fragments/category';
import { categoryWithAncestors } from 'src/graphql/fragments/categoryWithAncestors';
import { validatePageFilter } from 'src/graphql/utils/pagination';

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
          ... CategoryWithAncestors
          children(${validatePageFilter(filter)}) {
            edges {
              node {
                ... Category
                children(${validatePageFilter(filter)}) {
                  edges {
                    node {
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

const b2bQuery = b2cQuery;

export const categoriesQuery = (filter, isb2c = false) => {
  return graphqlQueryCheck(b2bQuery(filter), b2cQuery(filter), isb2c);
};
