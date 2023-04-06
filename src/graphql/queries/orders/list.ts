import { gql } from 'graphql-request';
import { validatePageFilter } from 'src/graphql/utils/pagination';
import { orderListFilterValidation } from 'src/modules/orders/Orders.utils';
import { OrdersListDTO } from 'src/modules/orders/dto/list';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';

const b2bQuery = (filter: OrdersListDTO): string => {
  const filters = orderListFilterValidation(filter);
  const pagination = validatePageFilter(filter);
  return gql`
    query {
      orders(
        ${pagination}
        filter: {
          ids: ${filters.orderIds}
          paymentStatus: ${filters.paymentStatus}
          status: ${filters.status}
          customer: "${filters.customer}"
          created: { gte: "${filters.startDate}", lte: "${filters.endDate}" }
          metadata:[
            ${
              filter.userEmail
                ? `{key:"userEmail", value: "${filter.userEmail}"}`
                : ''
            },
            ${
              filter.shopId ? `{key:"storeId", value: "${filter.shopId}"}` : ''
            },
          ]
        }
      ) {
        totalCount
        pageInfo {
          hasNextPage
          endCursor
          startCursor
          hasPreviousPage
        }
        edges {
          node {
            metadata {
              key
              value
            }
            id
            token
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
            shippingAddress {
              streetAddress1
              streetAddress2
            }
            deliveryMethod {
              ... on ShippingMethod {
                minimumDeliveryDays
                maximumDeliveryDays
                name
              }
            }
            total {
              gross {
                amount
              }
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

const b2cQuery = b2bQuery;

export const ordersListQuery = (filter: OrdersListDTO, isB2c = false) => {
  return graphqlQueryCheck(b2bQuery(filter), b2cQuery(filter), isB2c);
};
