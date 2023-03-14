import { Injectable, Logger } from '@nestjs/common';
import { validateCheckoutHandler } from 'src/graphql/handlers/checkout/checkout';

@Injectable()
export class CheckoutValidationService {
  private readonly logger = new Logger(CheckoutValidationService.name);

  public async validateCheckout(
    checkoutId: string,
    token: string,
    throwException = false,
  ) {
    try {
      const marketplaceResponse = await validateCheckoutHandler(
        checkoutId,
        token,
      );
      const isValid = marketplaceResponse['isValid'];
      return { isValid, ...marketplaceResponse };
    } catch (error) {
      this.logger.error(error);
      if (throwException) {
        throw error;
      }
      return { isValid: false };
    }
  }
}
