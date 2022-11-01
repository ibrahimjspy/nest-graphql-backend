import {
  graphqlCall,
  graphqlResultErrorHandler,
} from 'src/core/proxies/graphqlHandler';
import * as RetailerQueries from 'src/graphql/queries/retailer';
import RecordNotFound from 'src/core/exceptions/recordNotFound';
import { GQL_EDGES_KEY } from 'src/constants';

export const recentOrdersHandler = async (
  email: string,
  throwException: boolean = false,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(RetailerQueries.recentOrdersQuery(email)),
    throwException,
  );
  if (!response['orders'][GQL_EDGES_KEY]) {
    throw new RecordNotFound('Orders');
  }
  return response['orders'][GQL_EDGES_KEY];
};
