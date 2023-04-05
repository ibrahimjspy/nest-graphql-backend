import { gql } from 'graphql-request';
import { graphqlQueryCheck } from 'src/core/proxies/graphqlQueryToggle';
import { validatePageFilter } from 'src/graphql/utils/pagination';
import { ShopOrdersListDTO } from 'src/modules/orders/dto/list';

const b2bQuery = (shopId:string, filter: ShopOrdersListDTO): string => {
  const pagination = validatePageFilter(filter);
  return gql`
    query {
      marketplaceOrders(
        ${pagination}
        filter: {
          shopId: ${shopId}
          ${filter.email ? `email: "${filter.email}"`:""}
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
            orderId
          }
        }
      }
    }
  `;
};

const b2cQuery = b2bQuery;

// returns shop orders query based on federation and mock check
export const shopOrdersListQuery = (shopId: string, filter: ShopOrdersListDTO) => {
  return graphqlQueryCheck(b2bQuery(shopId, filter), b2cQuery(shopId, filter));
};
