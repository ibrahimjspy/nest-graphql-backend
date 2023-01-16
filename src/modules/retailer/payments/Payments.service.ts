import { Injectable } from '@nestjs/common';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import { prepareSuccessResponse } from 'src/core/utils/response';
import {
  getPurchaseHistoryHandler,
  getSalesReportHandler,
  getTransactionHistoryHandler,
} from 'src/graphql/handlers/retailer/payments';

@Injectable()
export class PaymentsService {
  public async getSalesReport(
    shopId: string,
    fromDate: string,
    toDate: string,
    token: string,
  ): Promise<object> {
    try {
      return prepareSuccessResponse(
        await getSalesReportHandler(shopId, fromDate, toDate, token),
      );
    } catch (error) {
      return graphqlExceptionHandler(error);
    }
  }

  public async getTransactionHistory(
    shopId: string,
    fromDate: string,
    toDate: string,
    token: string,
  ): Promise<object> {
    try {
      return prepareSuccessResponse(
        await getTransactionHistoryHandler(shopId, fromDate, toDate, token),
      );
    } catch (error) {
      return graphqlExceptionHandler(error);
    }
  }

  public async getPurchaseHistory(
    shopId: string,
    token: string,
  ): Promise<object> {
    try {
      return prepareSuccessResponse(
        await getPurchaseHistoryHandler(shopId, token),
      );
    } catch (error) {
      return graphqlExceptionHandler(error);
    }
  }
}
