import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
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
import { CartService } from '../Cart.service';
@Injectable()
export class CartRollbackService {
  private readonly logger = new Logger(CartRollbackService.name);

  constructor(
    private marketplaceCartService: MarketplaceCartService,
    private saleorCartService: SaleorCartService,
    @Inject(forwardRef(() => CartService))
    private cartService: CartService,
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
        `Rolling back marketplace bundles created due to failure in Saleor `,
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
        `Rolling back Marketplace bundles deleted due to failure in Saleor `,
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
   * @description -- this method rolls back checkout lines deleted due to failure in marketplace delete checkout bundles
   */
  public async deleteCheckoutBundlesMarketplace(
    checkoutBundles,
    userEmail,
    checkoutId,
    token: string,
  ) {
    try {
      const addBundles = getBundlesFromCheckout(checkoutBundles);
      this.logger.warn(
        `Rolling back Saleor lines deleted due to failure in Marketplace`,
      );
      return await this.saleorCartService.addBundleLines(
        userEmail,
        checkoutId,
        addBundles,
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
        `Rolling back Marketplace bundles deleted due to failure in Saleor`,
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
        `Rolling back Marketplace bundles state updated due to failure in Saleor`,
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
   * @description -- this method rolls back when old bundle is not deleted correctly and new one is created in place of it
   */
  public async replaceBundleDelete(
    newBundleCreated,
    newBundleId,
    token: string,
  ) {
    try {
      const userEmail = newBundleCreated?.marketplace?.userEmail;
      const checkoutBundles = newBundleCreated?.marketplace?.checkoutBundles;
      const checkoutBundle = getTargetBundleByBundleId(checkoutBundles, [
        { bundleId: newBundleId },
      ]);
      const checkoutBundleId = checkoutBundle[0]?.checkoutBundleId;
      this.logger.warn(
        `Rolling back new bundle created due to failure in delete old bundle`,
      );
      return await this.cartService.deleteBundlesFromCart(
        userEmail,
        [checkoutBundleId],
        token,
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  /**
   * @description -- this method rolls back when old bundle is not deleted correctly and new one is created in place of it
   */
  public async replaceBundleCreate(
    userEmail,
    checkoutId,
    checkoutBundle,
    token: string,
  ) {
    try {
      const addBundles = getBundlesFromCheckout(checkoutBundle);
      this.logger.warn(
        `Rolling back old bundle deleted due to failure in create new bundle against checkout :: ${checkoutId}`,
      );
      return await this.cartService.addBundlesToCart(
        userEmail,
        checkoutId,
        addBundles,
        token,
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }
}
