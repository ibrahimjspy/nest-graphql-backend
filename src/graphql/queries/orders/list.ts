import { gql } from 'graphql-request';
import { PaginationDto } from 'src/graphql/dto/pagination.dto';
import { validatePageFilter } from 'src/graphql/utils/pagination';

const federationQuery = (
  orderIds: string,
  pagination: PaginationDto,
): string => {
  const filter = validatePageFilter(pagination);
  return gql`
    query {
      orders(${filter}, filter: { ids: [${orderIds}] } ) {
        pageInfo{
          hasNextPage
          endCursor
          startCursor
          hasPreviousPage
        }
        edges {
          node {
            id
            number
            created
            status
            lines {
              variant {
                id
              }
            }
            user {
              firstName
              lastName
              email
            }
            total {
              net {
                amount
              }
            }
          }
        }
      }
    }
  `;
};

// returns shop order list query
export const ordersListQuery = (
  orderIds: string,
  filter: PaginationDto,
): string => {
  return federationQuery(orderIds, filter);
};
