import {
  graphqlCall,
  graphqlResultErrorHandler,
} from 'src/core/proxies/graphqlHandler';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import RecordNotFound from 'src/core/exceptions/recordNotFound';
import {
  getAccountInfoQuery,
  getPurchaseHistoryQuery,
  getSalesReportQuery,
  getTransactionHistoryQuery,
} from 'src/graphql/queries/retailer';

export const getSalesReportHandler = async (
  shopId: string,
  token: string,
): Promise<object> => {
  try {
    const response = await graphqlResultErrorHandler(
      await graphqlCall(getSalesReportQuery(shopId), token),
    );
    return response['marketplaceShop'];
  } catch (error) {
    return graphqlExceptionHandler(error);
  }
};

export const getAccountInfoHandler = async (
  shopId: string,
  token: string,
): Promise<object> => {
  try {
    const response = await graphqlResultErrorHandler(
      await graphqlCall(getAccountInfoQuery(shopId), token),
    );
    return response['marketplaceShop'];
  } catch (error) {
    return graphqlExceptionHandler(error);
  }
};

export const getTransactionHistoryHandler = async (
  shopId: string,
  token: string,
): Promise<object> => {
  try {
    const response = await graphqlResultErrorHandler(
      await graphqlCall(getTransactionHistoryQuery(shopId), token),
    );
    return response['marketplaceShop'];
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
    return response['marketplaceShop'];
  } catch (error) {
    return graphqlExceptionHandler(error);
  }
};
