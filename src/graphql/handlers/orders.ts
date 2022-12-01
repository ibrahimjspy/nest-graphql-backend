import {
  allShopOrdersQuery,
  dashboardQuery,
  orderActivityQuery,
  orderDetailsQuery,
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
import { orderIdsTransformer } from '../utils/orders';

export const dashboardByIdHandler = async (
  id: string,
  header: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(dashboardQuery(id), header, 'true'),
  );
  return response;
};

export const allShopOrdersHandler = async (header: string): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(allShopOrdersQuery(), header),
  );
  if (!response['marketplaceShops']) {
    throw new RecordNotFound('Marketplace shops');
  }
  return response['marketplaceShops'];
};

export const orderDetailsHandler = async (
  id: string,
  header: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(orderDetailsQuery(id), header),
  );
  if (!response['order']) {
    throw new RecordNotFound('Order details');
  }
  return response['order'];
};

export const shopOrdersByIdHandler = async (
  id: string,
  header: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(shopOrdersQuery(id), header),
  );
  if (!response['marketplaceShop']) {
    throw new RecordNotFound('Shop details');
  }
  return response['marketplaceShop'];
};

export const shopOrderFulfillmentsByIdHandler = async (
  id: string,
  header: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(shopOrderFulfillmentsQuery(id), header),
  );
  if (!response['marketplaceOrders']?.length) {
    throw new RecordNotFound('Shop order');
  }
  return response['marketplaceOrders'][0];
};

export const shopOrderFulfillmentsDetailsHandler = async (
  id: string,
  header: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(shopOrderFulfillmentDetailsQuery(id), header),
  );
  if (!response['order']) {
    throw new RecordNotFound('Shop order fulfillment details');
  }
  return response['order'];
};
export const orderActivityHandler = async (header: string): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(orderActivityQuery(), header),
  );

  if (!response['homepageEvents']?.[GQL_EDGES]?.length) {
    throw new RecordNotFound('Order activity');
  }
  return response['homepageEvents'][GQL_EDGES];
};

export const ordersListByIdsHandler = async (
  ids: string[],
  header: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(ordersListQuery(orderIdsTransformer(ids)), header),
  );
  if (!response['orders']) {
    throw new RecordNotFound('order details');
  }
  return response['orders'];
};
