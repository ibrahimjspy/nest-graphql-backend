import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { OrderReturnFilterDTO } from 'src/modules/orders/dto/order-returns.dto';
import { DEFAULT_CHANNEL } from 'src/constants';
import {
  OrderReturnDirectionEnum,
  OrderReturnSortFieldEnum,
} from 'src/modules/orders/dto/order-returns.dto';
import { getReturnPaginationFilters } from 'src/graphql/handlers/orders';

/**
 * @warn first: This filter is hard-coded for now. 
  But after implementation of status mapping in DB this will be replaced 
 */
const federationQuery = (filters: OrderReturnFilterDTO): string => {
  const filter = getReturnPaginationFilters(filters);
  const paginationCountKey = filter['countKey'];
  const cursorKey = filter['cursorKey'];
  return gql`
    query {
      orders(
        ${paginationCountKey}: ${filter[paginationCountKey]}
        ${cursorKey}: ${filter[cursorKey]}
        channel: ${filters.channel || JSON.stringify(DEFAULT_CHANNEL)}  
        sortBy: { 
          field: ${filters.sort_field || OrderReturnSortFieldEnum.CREATED_AT}
          direction: ${filters.sort_order || OrderReturnDirectionEnum.DESC}
        }
      ) {
        pageInfo {
          hasNextPage
          endCursor
          hasPreviousPage
          startCursor
        }
        totalCount
        edges {
          cursor
          node {
            id
            number
            user {
              firstName
              lastName
              email
              note
              addresses {
                phone
              }
            }
            statusDisplay
            status
            fulfillments {
              id
              status
              created
              trackingNumber
              lines {
                quantity
                orderLine {
                  totalPrice {
                    gross {
                      amount
                      currency
                    }
                  }
                }
              }
            }
            billingAddress {
              firstName
              lastName
              streetAddress1
              streetAddress2
              city
              country {
                code
              }
              countryArea
              isDefaultShippingAddress
            }
            number
            created
          }
        }
      }
    }
  `;
};

// return all order that are returns from customer to sharove warehouse
export const orderReturnsQuery = (filters: OrderReturnFilterDTO) => {
  return graphqlQueryCheck(federationQuery(filters), federationQuery(filters));
};
