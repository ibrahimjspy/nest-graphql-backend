import { Injectable, Logger } from '@nestjs/common';
import { SaleorCartService } from './saleor/Cart.saleor.service';
import { MarketplaceCartService } from './marketplace/Cart.marketplace.service';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import {
  getAddBundleToCartLines,
  getBundleIds,
  getBundlesFromCheckout,
  getCheckoutBundleIds,
  getTargetBundleByBundleId,
} from '../Cart.utils';
import { ProductService } from 'src/modules/product/Product.service';
import { getUpdatedLinesRollback } from './Rollback.utils';
import { CheckoutLinesInterface } from './saleor/Cart.saleor.types';

@Injectable()
export class CartRollbackService {
  private readonly logger = new Logger(CartRollbackService.name);

  constructor(
    private marketplaceCartService: MarketplaceCartService,
    private saleorCartService: SaleorCartService,
    private productService: ProductService,
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
   * @description -- this method rolls back checkout bundles created due to failure in marketplace add bundles
   */
  public async addCheckoutBundlesMarketplace(
    saleorResponse,
    userBundles,
    token,
  ) {
    try {
      const checkoutId = saleorResponse['id'];
      const bundleIds = getBundleIds(userBundles);
      const bundlesData = await this.productService.getProductBundles({
        bundleIds: bundleIds,
        first: 100,
      });
      const saleorLines = getAddBundleToCartLines(
        bundlesData['data'],
        userBundles,
      );
      const updatedSaleorLines: CheckoutLinesInterface =
        getUpdatedLinesRollback(saleorResponse, saleorLines);
      this.logger.warn(
        `Rolling back saleor lines created after add checkout lines failed :: ${checkoutId}`,
      );
      return await this.saleorCartService.updateLines(
        checkoutId,
        updatedSaleorLines,
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
      const action = true;
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
      const action = false;
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
