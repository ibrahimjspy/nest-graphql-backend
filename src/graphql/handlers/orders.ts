import {
  allShopOrdersQuery,
  dashboardQuery,
  orderActivityQuery,
  orderDetailsQuery,
  orderReturnsQuery,
  shopOrderFulfillmentDetailsQuery,
  shopOrderFulfillmentsQuery,
  shopOrdersQuery,
} from 'src/graphql/queries/orders';
import {
  graphqlCall,
  graphqlResultErrorHandler,
} from 'src/core/proxies/graphqlHandler';
import RecordNotFound from 'src/core/exceptions/recordNotFound';
import { ordersListQuery } from '../queries/orders/list';
import { GQL_EDGES } from 'src/constants';
import {
  filterReturnedOrderIds,
  hasNextPage,
  orderBundlesTransformer,
} from '../utils/orders';
import { addOrderToShopMutation } from '../mutations/order/addOrderToShop';
import { OrdersListDTO } from 'src/modules/orders/dto/list';
import { OrderReturnFilterDTO } from 'src/modules/orders/dto/order-returns.dto';
import { getOrderStatus } from '../queries/orders/getOrderStatuses';

export const dashboardByIdHandler = async (
  id: string,
  token: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(dashboardQuery(id), token, 'true'),
  );
  return response;
};

export const allShopOrdersHandler = async (token: string): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(allShopOrdersQuery(), token),
  );
  if (!response['marketplaceShops']) {
    throw new RecordNotFound('Marketplace shops');
  }
  return response['marketplaceShops'];
};

export const orderDetailsHandler = async (
  id: string,
  token: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(orderDetailsQuery(id), token),
  );
  if (!response['order']) {
    throw new RecordNotFound('Order details');
  }
  return response['order'];
};

export const shopOrdersByIdHandler = async (
  id: string,
  token: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(shopOrdersQuery(id), token),
  );
  if (!response['marketplaceShop']) {
    throw new RecordNotFound('Shop details');
  }
  return response['marketplaceShop'];
};

export const shopOrderFulfillmentsByIdHandler = async (
  id: string,
  token: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(shopOrderFulfillmentsQuery(id), token),
  );
  if (!response['marketplaceOrders']?.length) {
    throw new RecordNotFound('Shop order');
  }
  return response['marketplaceOrders'][0];
};

export const shopOrderFulfillmentsDetailsHandler = async (
  id: string,
  token: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(shopOrderFulfillmentDetailsQuery(id), token),
  );
  if (!response['order']) {
    throw new RecordNotFound('Shop order fulfillment details');
  }
  return response['order'];
};
export const orderActivityHandler = async (token: string): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(orderActivityQuery(), token),
  );

  if (!response['homepageEvents']?.[GQL_EDGES]?.length) {
    throw new RecordNotFound('Order activity');
  }
  return response['homepageEvents'][GQL_EDGES];
};

export const ordersListHandler = async (
  filter: OrdersListDTO,
  token: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(ordersListQuery(filter), token),
  );
  if (!response['orders']) {
    throw new RecordNotFound('order details');
  }
  return response['orders'];
};

export const addOrderToShopHandler = async (order) => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      addOrderToShopMutation(
        order[0], //uses default bundle information for shop and shipping details
        orderBundlesTransformer(order), //transforms bundles array to graphql string
      ),
    ),
  );
  return response['addOrderToShop'];
};

export const orderReturnListHandler = async (
  filters: OrderReturnFilterDTO,
  token: string,
) => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(orderReturnsQuery(filters), token),
  );
  return response;
};

/**
 * returns order ids of all the orders that have status of RETURNED
 * @warn performance implication || this api parses all of the order ids which is not ideal
 * @returns list of orderIds || string[]
 */
export const getReturnOrderIdsHandler = async (
  token: string,
  after = '',
): Promise<string[]> => {
  let returnedOrderIds = [];
  const orderStatuses = await graphqlResultErrorHandler(
    await graphqlCall(getOrderStatus(after), token),
  );
  const orderIds = filterReturnedOrderIds(orderStatuses['orders'].edges);
  returnedOrderIds = returnedOrderIds.concat(orderIds);
  // check if next page exists add its ids as well
  const nextPage = hasNextPage(orderStatuses['orders'].pageInfo);
  if (nextPage) {
    const nextPageOrderIds = await getReturnOrderIdsHandler(token, nextPage);
    returnedOrderIds = returnedOrderIds.concat(nextPageOrderIds);
  }
  return returnedOrderIds;
};
