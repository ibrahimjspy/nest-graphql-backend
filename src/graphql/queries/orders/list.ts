import { gql } from 'graphql-request';
import { validatePageFilter } from 'src/graphql/utils/pagination';
import { orderListFilterValidation } from 'src/modules/orders/Orders.utils';
import { OrdersListFiltersDTO } from 'src/modules/orders/dto/list';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { pageInfoFragment } from 'src/graphql/fragments/pageInfo';

const b2bQuery = (filter: OrdersListFiltersDTO): string => {
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
          ... PageInfo
        }
        edges {
          node {
            metadata {
              ... Metadata
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
    ${pageInfoFragment}
  `;
};

const b2cQuery = b2bQuery;

export const ordersListQuery = (
  filter: OrdersListFiltersDTO,
  isB2c = false,
) => {
  return graphqlQueryCheck(b2bQuery(filter), b2cQuery(filter), isB2c);
};
