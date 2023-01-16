import {
  graphqlCall,
  graphqlResultErrorHandler,
} from 'src/core/proxies/graphqlHandler';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import RecordNotFound from 'src/core/exceptions/recordNotFound';
import {
  getPurchaseHistoryQuery,
  getSalesReportQuery,
  getTransactionHistoryQuery,
} from 'src/graphql/queries/retailer';

export const getSalesReportHandler = async (
  shopId: string,
  fromDate: string,
  toDate: string,
  token: string,
): Promise<object> => {
  try {
    const response = await graphqlResultErrorHandler(
      await graphqlCall(getSalesReportQuery(shopId, fromDate, toDate), token),
    );
    if (!response['salesReport']) {
      throw new RecordNotFound('Sales report');
    }
    return response['salesReport'];
  } catch (error) {
    return graphqlExceptionHandler(error);
  }
};

export const getTransactionHistoryHandler = async (
  shopId: string,
  fromDate: string,
  toDate: string,
  token: string,
): Promise<object> => {
  try {
    const response = await graphqlResultErrorHandler(
      await graphqlCall(
        getTransactionHistoryQuery(shopId, fromDate, toDate),
        token,
      ),
    );
    if (!response['transactionHistory']) {
      throw new RecordNotFound('Transaction history');
    }
    return response['transactionHistory'];
  } catch (error) {
    return graphqlExceptionHandler(error);
  }
};

export const getPurchaseHistoryHandler = async (
  shopId: string,
  token: string,
): Promise<object> => {
  try {
    const response = await graphqlResultErrorHandler(
      await graphqlCall(getPurchaseHistoryQuery(shopId), token),
    );
    if (!response['purchaseHistory']) {
      throw new RecordNotFound('Purchase history');
    }
    return response['purchaseHistory'];
  } catch (error) {
    return graphqlExceptionHandler(error);
  }
};
