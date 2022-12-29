import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { OrderReturnFilterDTO } from 'src/modules/orders/dto/order-returns.dto';
import { DEFAULT_CHANNEL, DEFAULT_PAGE_SIZE } from 'src/constants';
import {
  OrderReturnDirectionEnum,
  OrderReturnSortFieldEnum,
} from 'src/modules/orders/dto/order-returns.dto';

const federationQuery = (filters: OrderReturnFilterDTO): string => {
  return gql`
    query {
      orders(
        first: ${filters.first || DEFAULT_PAGE_SIZE}
        after: ${filters.after || JSON.stringify('')} 
        channel: ${filters.channel || JSON.stringify(DEFAULT_CHANNEL)}  
        sortBy: { 
          field: ${filters.sort_field || OrderReturnSortFieldEnum.CREATED_AT}
          direction: ${filters.sort_order || OrderReturnDirectionEnum.DESC}
        }
      ) {
        pageInfo {
          hasNextPage
          endCursor
        }
        totalCount
        edges {
          node {
            id
            number
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
