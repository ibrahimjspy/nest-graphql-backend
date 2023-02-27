import { Injectable, Logger } from '@nestjs/common';
import { getCheckoutBundlesHandler } from 'src/graphql/handlers/checkout/checkout';

@Injectable()
export class MarketplaceCheckoutService {
  private readonly logger = new Logger(MarketplaceCheckoutService.name);

  public async getCheckout(userEmail: string, token: string) {
    return await getCheckoutBundlesHandler(userEmail, token);
  }
}
