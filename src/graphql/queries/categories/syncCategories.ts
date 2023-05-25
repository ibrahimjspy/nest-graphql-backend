import { gql } from 'graphql-request';
import { PaginationDto } from 'src/graphql/dto/pagination.dto';
import { validatePageFilter } from 'src/graphql/utils/pagination';

export const syncCategoriesQuery = (
  level: number,
  pagination: PaginationDto,
): string => {
  const productFilter = `{ isPublished: true, isAvailable: true, metadata: {key: "isMaster", value: "true"} }`;
  return gql`
    query {
      categories(level: ${level}, ${validatePageFilter(pagination)}) {
        totalCount
        edges {
          node {
            id
            name
            products(
              first: 1
              filter: ${productFilter}
            ) {
              totalCount
            }
          }
        }
      }
    }
  `;
};
