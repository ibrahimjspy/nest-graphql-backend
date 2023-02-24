import { Injectable, Logger } from '@nestjs/common';
import {
  addLinesHandler,
  deleteLinesHandler,
  updateLinesHandler,
} from 'src/graphql/handlers/checkout/cart/cart.saleor';
import { CheckoutLinesInterface } from './Cart.saleor.types';

@Injectable()
export class SaleorCartService {
  private readonly logger = new Logger(SaleorCartService.name);

  public async addLines(
    checkoutId: string,
    checkoutLines: CheckoutLinesInterface,
    token: string,
  ) {
    try {
      const response = await addLinesHandler(checkoutId, checkoutLines, token);
      return response;
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async updateLines(
    checkoutId: string,
    checkoutLines: CheckoutLinesInterface,
    token: string,
  ) {
    try {
      const response = await updateLinesHandler(
        checkoutId,
        checkoutLines,
        token,
      );
      return response;
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async deleteLines(
    checkoutId: string,
    lineIds: string[],
    token: string,
  ) {
    try {
      const response = await deleteLinesHandler(checkoutId, lineIds, token);
      return response;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
