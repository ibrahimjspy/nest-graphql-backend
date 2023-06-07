import { Injectable, Logger } from '@nestjs/common';
import { LineType } from 'src/graphql/handlers/checkout.type';
import {
  createCheckoutHandler,
  getCheckoutHandler,
} from 'src/graphql/handlers/checkout/checkout';
import { SaleorCheckoutInterface } from '../Checkout.utils.type';

@Injectable()
export class SaleorCheckoutService {
  private readonly logger = new Logger(SaleorCheckoutService.name);

  public async createCheckout(
    userEmail: string,
    checkoutLines: LineType[],
    token: string,
    throwException = true,
  ) {
    try {
      const checkoutCreate = await createCheckoutHandler(
        userEmail,
        checkoutLines,
        token,
      );
      this.logger.log('Created new checkout', checkoutLines);
      return checkoutCreate['checkout'];
    } catch (error) {
      this.logger.error(error);
      if (throwException) {
        throw error;
      }
    }
  }

  public async getCheckout(
    checkoutId: string,
    token: string,
  ): Promise<SaleorCheckoutInterface> {
    return await getCheckoutHandler(checkoutId, token);
  }
}
