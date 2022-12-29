import RecordNotFound from 'src/core/exceptions/recordNotFound';
import {
  graphqlCall,
  graphqlResultErrorHandler,
} from 'src/core/proxies/graphqlHandler';
import { ReportingPeriodEnum } from '../enums/orders';
import { dailySalesQuery } from '../queries/orders/reporting/dailySales';
import { getOrdersCountQuery } from '../queries/orders/reporting/totalOrders';
import { getPartiallyFulfilledOrdersCountQuery } from '../queries/orders/reporting/partiallyFulfiled';
import { getFulfilledOrdersCountQuery } from '../queries/orders/reporting/fulfilled';
import { getReadyToFulfillOrdersCountQuery } from '../queries/orders/reporting/readyToFulfill';

export const dailySalesHandler = async (
  reportingTime = 'TODAY',
  token: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      dailySalesQuery(ReportingPeriodEnum[reportingTime]),
      token,
    ),
  );
  if (!response['ordersTotal']) {
    throw new RecordNotFound('order details');
  }
  return response['ordersTotal'];
};

export const getOrdersCountHandler = async (token: string) => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(getOrdersCountQuery(), token),
  );
  return response['orders']['totalCount'];
};

export const getFulfilledOrdersCountHandler = async (token: string) => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(getFulfilledOrdersCountQuery(), token),
  );
  return response['orders']['totalCount'];
};

export const getPartiallyFulfilledOrdersCountHandler = async (
  token: string,
) => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(getPartiallyFulfilledOrdersCountQuery(), token),
  );
  return response['orders']['totalCount'];
};

export const getReadyToFulfillOrdersCountHandler = async (token: string) => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(getReadyToFulfillOrdersCountQuery(), token),
  );
  return response['orders']['totalCount'];
};
