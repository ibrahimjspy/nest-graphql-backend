import { Injectable, Logger } from '@nestjs/common';
import { SaleorCartService } from './saleor/Cart.saleor.service';
import { MarketplaceCartService } from './marketplace/Cart.marketplace.service';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import {
  getBundlesFromCheckout,
  getCheckoutBundleIds,
  getTargetBundleByBundleId,
} from '../Cart.utils';

@Injectable()
export class CartRollbackService {
  private readonly logger = new Logger(CartRollbackService.name);

  constructor(
    private marketplaceCartService: MarketplaceCartService,
    private saleorCartService: SaleorCartService,
  ) {}

  /**
   * @description -- this method rolls back checkout bundles created due to failure in saleor add bundle lines
   */
  public async addCheckoutBundleLinesSaleor(
    marketplaceResponse,
    userBundles,
    token,
  ) {
    try {
      const userEmail = marketplaceResponse.userEmail;
      const checkoutBundleIds = getCheckoutBundleIds(
        getTargetBundleByBundleId(
          marketplaceResponse['checkoutBundles'],
          userBundles,
        ),
      );

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

  /**
   * @description -- this method rolls back checkout bundles deleted due to failure in saleor delete bundle lines
   */
  public async deleteCheckoutBundleLinesSaleor(
    { checkoutBundlesData, userEmail },
    token: string,
  ) {
    try {
      const bundlesList = getBundlesFromCheckout(checkoutBundlesData);
      this.logger.warn(
        `Rolling back Marketplace bundles deleted due to failure in Saleor against user :: ${userEmail}`,
      );
      return await this.marketplaceCartService.addBundles(
        userEmail,
        bundlesList,
        token,
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  /**
   * @description -- this method rolls back checkout bundles state changed due to failure in saleor lines update
   */
  public async selectBundlesSaleor(
    checkoutBundleIds,
    userEmail,
    token: string,
  ) {
    try {
      const action = 'select';
      const bundlesList: any = { checkoutBundleIds, userEmail };
      this.logger.warn(
        `Rolling back Marketplace bundles deleted due to failure in Saleor against user :: ${userEmail}`,
      );
      return await this.marketplaceCartService.updateCheckoutBundleState(
        action,
        bundlesList,
        token,
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  /**
   * @description -- this method rolls back checkout bundles state changed due to failure in saleor lines update
   */
  public async unselectBundlesSaleor(
    checkoutBundleIds,
    userEmail,
    token: string,
  ) {
    try {
      const action = 'select';
      const bundlesList: any = { checkoutBundleIds, userEmail };
      this.logger.warn(
        `Rolling back Marketplace bundles state updated due to failure in Saleor against user :: ${userEmail}`,
      );
      return await this.marketplaceCartService.updateCheckoutBundleState(
        action,
        bundlesList,
        token,
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }
}
