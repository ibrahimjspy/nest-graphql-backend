import { Injectable, Logger, Inject } from '@nestjs/common';
import RecordNotFound from 'src/core/exceptions/recordNotFound';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import {
  prepareFailedResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import * as RetailerHandlers from 'src/graphql/handlers/retailer';

@Injectable()
export class RetailerService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}
  private readonly logger = new Logger(RetailerService.name);
  private readonly authorizationToken = this.request.headers.authorization;

  public async getRecentOrdersData(email: string): Promise<object> {
    const Throw_Exception = true;
    try {
      const recentOrders = await RetailerHandlers.recentOrdersHandler(
        email,
        this.authorizationToken,
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
