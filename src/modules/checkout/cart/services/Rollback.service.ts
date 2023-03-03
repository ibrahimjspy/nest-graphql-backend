import { Injectable, Logger } from '@nestjs/common';
import { SaleorCartService } from './saleor/Cart.saleor.service';
import { MarketplaceCartService } from './marketplace/Cart.marketplace.service';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';

@Injectable()
export class CartRollbackService {
  private readonly logger = new Logger(CartRollbackService.name);

  constructor(
    private marketplaceCartService: MarketplaceCartService,
    private saleorCartService: SaleorCartService,
  ) {}

  public async addCheckoutBundleLinesSaleor(
    userEmail: string,
    checkoutBundleIds: string[],
    token: string,
  ) {
    try {
      this.logger.warn(
        `Rolling back marketplace bundles created due to failure in Saleor against user :: ${userEmail}`,
      );
      return await this.marketplaceCartService.deleteBundles(
        userEmail,
        checkoutBundleIds,
        token,
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async addCheckoutBundlesMarketplace(
    checkoutId: string,
    lineIds: string[],
    token: string,
  ) {
    try {
      this.logger.warn(
        `Rolling back Saleor lines created due to failure in Saleor against checkout :: ${checkoutId}`,
      );
      return await this.saleorCartService.deleteLines(
        checkoutId,
        lineIds,
        token,
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }
}
