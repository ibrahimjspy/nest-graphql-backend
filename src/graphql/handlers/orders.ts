import { dashboardQuery } from 'src/graphql/queries/orders/dashboardById';
import { allShopOrdersQuery } from 'src/graphql/queries/orders/allShopOrders';
import { shopOrdersQuery } from 'src/graphql/queries/orders/shopOrdersById';
import { shopOrderFulfillmentsQuery } from 'src/graphql/queries/orders/shopOrderFulfillmentsById';
import { orderActivityQuery } from 'src/graphql/queries/orders/orderActivity';
import {
  graphqlCall,
  graphqlExceptionHandler,
  graphqlResultErrorHandler,
} from 'src/core/proxies/graphqlHandler';
import { orderDetails } from '../queries/orders/orderDetails';
import RecordNotFound from 'src/core/exceptions/recordNotFound';

export const dashboardByIdHandler = async (id: string): Promise<object> => {
  try {
    return await graphqlCall(dashboardQuery(id), 'true');
  } catch (error) {
    return graphqlExceptionHandler(error);
  }
};
export const allShopOrdersHandler = async (): Promise<object> => {
  try {
    const response = await graphqlCall(allShopOrdersQuery());
    return response['marketplaceShops'];
  } catch (error) {
    return graphqlExceptionHandler(error);
  }
};
export const orderDetailsHandler = async (id: string): Promise<object> => {
  try {
    const response = await graphqlCall(orderDetails(id));
    return response['order'];
  } catch (error) {
    return graphqlExceptionHandler(error);
  }
};
export const shopOrdersByIdHandler = async (id: string): Promise<object> => {
  try {
    return await graphqlCall(shopOrdersQuery(id));
  } catch (error) {
    return graphqlExceptionHandler(error);
  }
};
export const shopOrderFulfillmentsByIdHandler = async (
  id: string,
): Promise<object> => {
  try {
    return await graphqlCall(shopOrderFulfillmentsQuery(id));
  } catch (error) {
    return graphqlExceptionHandler(error);
  }
};
export const orderActivityHandler = async (): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(orderActivityQuery()),
  );
  if (!response['homepageEvents']?.['edges']) {
    throw new RecordNotFound('Order activity');
  }
  return response['homepageEvents']['edges'];
};
