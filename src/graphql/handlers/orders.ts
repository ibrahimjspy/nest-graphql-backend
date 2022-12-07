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
import { orderBundlesTransformer, orderIdsTransformer } from '../utils/orders';
import { addOrderToShopMutation } from '../mutations/order/addOrderToShop';

export const dashboardByIdHandler = async (
  id: string,
  headers: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(dashboardQuery(id), headers, 'true'),
  );
  return response;
};

export const allShopOrdersHandler = async (): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(allShopOrdersQuery()),
  );
  if (!response['marketplaceShops']) {
    throw new RecordNotFound('Marketplace shops');
  }
  return response['marketplaceShops'];
};

export const orderDetailsHandler = async (id: string): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(orderDetailsQuery(id)),
  );
  if (!response['order']) {
    throw new RecordNotFound('Order details');
  }
  return response['order'];
};

export const shopOrdersByIdHandler = async (
  id: string,
  headers: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(shopOrdersQuery(id), headers),
  );
  if (!response['marketplaceShop']) {
    throw new RecordNotFound('Shop details');
  }
  return response['marketplaceShop'];
};

export const shopOrderFulfillmentsByIdHandler = async (
  id: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(shopOrderFulfillmentsQuery(id)),
  );
  if (!response['marketplaceOrders']?.length) {
    throw new RecordNotFound('Shop order');
  }
  return response['marketplaceOrders'][0];
};

export const shopOrderFulfillmentsDetailsHandler = async (
  id: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(shopOrderFulfillmentDetailsQuery(id)),
  );
  if (!response['order']) {
    throw new RecordNotFound('Shop order fulfillment details');
  }
  return response['order'];
};
export const orderActivityHandler = async (): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(orderActivityQuery()),
  );

  if (!response['homepageEvents']?.[GQL_EDGES]?.length) {
    throw new RecordNotFound('Order activity');
  }
  return response['homepageEvents'][GQL_EDGES];
};

export const ordersListByIdsHandler = async (
  ids: string[],
  headers: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(ordersListQuery(orderIdsTransformer(ids))),
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
