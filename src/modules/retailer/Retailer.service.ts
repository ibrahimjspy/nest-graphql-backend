import { Injectable, Logger } from '@nestjs/common';
import RecordNotFound from 'src/core/exceptions/recordNotFound';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import {
  prepareFailedResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';

import * as RetailerHandlers from 'src/graphql/handlers/retailer';
@Injectable()
export class RetailerService {
  private readonly logger = new Logger(RetailerService.name);

  public async getRecentOrdersData(email: string): Promise<object> {
    const Throw_Exception = true;
    try {
      const recentOrders = await RetailerHandlers.recentOrdersHandler(
        email,
        Throw_Exception,
      );

      return prepareSuccessResponse(recentOrders);
    } catch (err) {
      this.logger.error(err);
      if (err instanceof RecordNotFound) {
        return prepareFailedResponse(err.message);
      }
      return graphqlExceptionHandler(err);
    }
  }
}
