import {
  dashboardQuery,
  allShopOrdersQuery,
  orderDetailsQuery,
  shopOrdersQuery,
  shopOrderFulfillmentsQuery,
  shopOrderFulfillmentDetailsQuery,
} from 'src/graphql/queries/orders';
import {
  graphqlCall,
  graphqlResultErrorHandler,
} from 'src/core/proxies/graphqlHandler';
import RecordNotFound from 'src/core/exceptions/recordNotFound';

export const dashboardByIdHandler = async (id: string): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(dashboardQuery(id), 'true'),
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

export const shopOrdersByIdHandler = async (id: string): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(shopOrdersQuery(id)),
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
