import { gql } from 'graphql-request';
import { DEFAULT_CHANNEL } from 'src/constants';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { PaginationDto } from 'src/graphql/dto/pagination.dto';
import { validatePageFilter } from 'src/graphql/utils/pagination';

export const federationQuery = (filter: PaginationDto): string => {
  const pageFilter = validatePageFilter(filter);

  return gql`
    query {
      reportProductSales(
        ${pageFilter}
        channel: "${DEFAULT_CHANNEL}"
        period: THIS_MONTH
      ) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          endCursor
          startCursor
        }
        edges {
          node {
            product {
              id
            }
          }
        }
      }
    }
  `;
};

export const popularItemsQuery = (filter: PaginationDto) => {
  return graphqlQueryCheck(federationQuery(filter), federationQuery(filter));
};
