import { gql } from 'graphql-request';
import { validatePageFilter } from 'src/graphql/utils/pagination';
import { orderFilterValidation } from 'src/modules/orders/Orders.utils';
import { OrdersListDTO } from 'src/modules/orders/dto/list';

const federationQuery = (filter: OrdersListDTO): string => {
  const filters = orderFilterValidation(filter);
  const pagination = validatePageFilter(filter);
  return gql`
    query {
      orders(
       ${pagination}
        filter: { ids: ${filters.orderIds}, paymentStatus: ${filters.paymentStatus}, status: ${filters.status}, customer: "${filters.customer}" }
      ) {
        pageInfo {
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
              id
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
export const ordersListQuery = (filter: OrdersListDTO): string => {
  return federationQuery(filter);
};
