import RecordNotFound from 'src/core/exceptions/recordNotFound';
import {
  graphqlCall,
  graphqlResultErrorHandler,
} from 'src/core/proxies/graphqlHandler';
import { ReportingPeriodEnum } from '../enums/orders';
import { dailySalesQuery } from '../queries/orders/reporting/dailySales';

export const dailySalesHandler = async (
  reportingTime = 'TODAY',
  header: string,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(
      dailySalesQuery(ReportingPeriodEnum[reportingTime]),
      header,
    ),
  );
  if (!response['ordersTotal']) {
    throw new RecordNotFound('order details');
  }
  return response['ordersTotal'];
};
