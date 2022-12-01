import {
  graphqlCall,
  graphqlResultErrorHandler,
} from 'src/core/proxies/graphqlHandler';
import * as RetailerQueries from 'src/graphql/queries/retailer';
import RecordNotFound from 'src/core/exceptions/recordNotFound';
import { GQL_EDGES } from 'src/constants';

export const recentOrdersHandler = async (
  email: string,
  header: string,
  throwException = false,
): Promise<object> => {
  const response = await graphqlResultErrorHandler(
    await graphqlCall(RetailerQueries.recentOrdersQuery(email), header),
    throwException,
  );
  if (!response['orders'][GQL_EDGES]) {
    throw new RecordNotFound('Orders');
  }
  return response['orders'][GQL_EDGES];
};
