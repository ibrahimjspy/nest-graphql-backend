import { dashboardQuery } from 'src/graphql/queries/orders/dashboardById';
import { allShopOrdersQuery } from 'src/graphql/queries/orders/allShopOrders';
import { shopOrdersQuery } from 'src/graphql/queries/orders/shopOrdersById';
import { shopOrderFulfillmentsQuery } from 'src/graphql/queries/orders/shopOrderFulfillmentsById';
import {
  graphqlCall,
  graphqlExceptionHandler,
} from 'src/core/proxies/graphqlHandler';
import { orderDetails } from '../queries/orders/orderDetails';

export const dashboardByIdHandler = async (id: string): Promise<object> => {
  try {
    return await graphqlCall(dashboardQuery(id), 'true');
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};
export const allShopOrdersHandler = async (): Promise<object> => {
  try {
    const response = await graphqlCall(allShopOrdersQuery());
    return response['marketplaceShops'];
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};
export const orderDetailsHandler = async (id: string): Promise<object> => {
  try {
    const response = await graphqlCall(orderDetails(id));
    return response['order'];
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};
export const shopOrdersByIdHandler = async (id: string): Promise<object> => {
  try {
    return await graphqlCall(shopOrdersQuery(id));
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};
export const shopOrderFulfillmentsByIdHandler = async (
  id: string,
): Promise<object> => {
  try {
    return await graphqlCall(shopOrderFulfillmentsQuery(id));
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};
