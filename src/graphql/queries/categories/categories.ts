import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { validatePageFilter } from 'src/graphql/utils/pagination';
import { shopCategoriesDTO } from 'src/modules/categories/dto/categories';

const b2cQuery = (categoryIds: string[], filter:shopCategoriesDTO): string => {
  return gql`
  query {
    categories(
      ${validatePageFilter(
        filter,
      )}
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

export const categoriesQuery = (categoryIds: string[], filter, isb2c = false) => {
  return graphqlQueryCheck(b2bQuery(categoryIds, filter), b2cQuery(categoryIds, filter), isb2c);
};
