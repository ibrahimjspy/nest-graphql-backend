import * as OrderQueries from 'src/graphql/queries/orders';
import {
  graphqlCall,
  graphqlResultErrorHandler,
} from 'src/core/proxies/graphqlHandler';

export const dashboardByIdHandler = async (id: string): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(OrderQueries.dashboardQuery(id), 'true'),
  );
  return response;
};

export const allShopOrdersHandler = async (): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(OrderQueries.allShopOrdersQuery()),
  );
  return response['marketplaceShops'];
};

export const orderDetailsHandler = async (id: string): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(OrderQueries.orderDetailsQuery(id)),
  );
  return response['order'];
};

export const shopOrdersByIdHandler = async (id: string): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(OrderQueries.shopOrdersQuery(id)),
  );
  return response['marketplaceShop'];
};

export const shopOrderFulfillmentsByIdHandler = async (
  id: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(OrderQueries.shopOrderFulfillmentsQuery(id)),
  );
  return response['marketplaceOrder'];
};

export const shopOrderFulfillmentsDetailsHandler = async (
  id: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(OrderQueries.shopOrderFulfillmentDetailsQuery(id)),
  );
  return response['order'];
};
