import { Injectable, Logger } from '@nestjs/common';
import { LineType } from 'src/graphql/handlers/checkout.type';
import {
  createCheckoutHandler,
  getCheckoutHandler,
} from 'src/graphql/handlers/checkout/checkout';

@Injectable()
export class SaleorCheckoutService {
  private readonly logger = new Logger(SaleorCheckoutService.name);

  public async createCheckout(
    userEmail: string,
    checkoutLines: LineType[],
    token: string,
  ) {
    const checkoutCreate = await createCheckoutHandler(
      userEmail,
      checkoutLines,
      token,
    );
    return checkoutCreate['checkout'];
  }

  public async getCheckout(checkoutId: string, token: string) {
    return await getCheckoutHandler(checkoutId, token);
  }
}
