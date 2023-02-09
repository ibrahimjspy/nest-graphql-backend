import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { validatePageFilter } from 'src/graphql/utils/pagination';
import { orderListFilterValidation } from 'src/modules/orders/Orders.utils';
import { ReturnOrderListDto } from 'src/modules/orders/dto/order-returns.dto';

const b2bQuery = (filter: ReturnOrderListDto): string => {
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
            metadata: { key: "isStaffReturn", value: "${filter.isStaffReturn}" }
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

const b2cQuery = (filter: ReturnOrderListDto): string => {
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

export const getReturnsListQuery = (
  filter: ReturnOrderListDto,
  isB2C = false,
) => {
  return graphqlQueryCheck(b2bQuery(filter), b2cQuery(filter), isB2C);
};
