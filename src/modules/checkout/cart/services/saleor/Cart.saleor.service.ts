import { Injectable, Logger } from '@nestjs/common';
import {
  addLinesHandler,
  deleteLinesHandler,
  updateLinesHandler,
} from 'src/graphql/handlers/checkout/cart/cart.saleor';
import { CheckoutLinesInterface } from './Cart.saleor.types';
import { MarketplaceCartService } from '../marketplace/Cart.marketplace.service';
import {
  getAddBundleToCartLines,
  getBundleIds,
  getDeleteBundlesLines,
  getUpdateCartBundleLines,
} from '../../Cart.utils';
import { SaleorCheckoutService } from 'src/modules/checkout/services/Checkout.saleor';
import { CheckoutBundleInputType } from 'src/graphql/handlers/checkout.type';
import { ProductService } from 'src/modules/product/Product.service';

@Injectable()
export class SaleorCartService {
  private readonly logger = new Logger(SaleorCartService.name);

  constructor(
    private marketplaceService: MarketplaceCartService,
    private saleorCheckoutService: SaleorCheckoutService,
    private productService: ProductService,
  ) {}

  public async addLines(
    checkoutId: string,
    checkoutLines: CheckoutLinesInterface,
    token: string,
    throwException = true,
  ) {
    try {
      return await addLinesHandler(checkoutId, checkoutLines, token);
    } catch (error) {
      this.logger.error(error);
      if (throwException) {
        throw error;
      }
    }
  }

  public async updateLines(
    checkoutId: string,
    checkoutLines: CheckoutLinesInterface,
    token: string,
    throwException = true,
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
      if (throwException) {
        throw error;
      }
    }
  }

  public async deleteLines(
    checkoutId: string,
    lineIds: string[],
    token: string,
    throwException = true,
  ) {
    try {
      return await deleteLinesHandler(checkoutId, lineIds, token);
    } catch (error) {
      this.logger.error(error);
      if (throwException) {
        throw error;
      }
    }
  }
  public async createCheckoutFromBundleLines(
    userEmail: string,
    checkoutLines,
    token: string,
  ) {
    const createCheckout = await this.saleorCheckoutService.createCheckout(
      userEmail,
      checkoutLines,
      token,
    );
    await this.marketplaceService.addCheckoutIdToMarketplace(
      userEmail,
      token,
      createCheckout['id'],
    );
    return createCheckout;
  }

  public async addBundleLines(
    userEmail: string,
    checkoutId: string,
    checkoutBundleLines: CheckoutBundleInputType[],
    token: string,
  ) {
    const bundleIds = getBundleIds(checkoutBundleLines);
    const bundlesData = await this.productService.getProductBundles({
      bundleIds: bundleIds,
      first: 100,
    });
    const saleorLines: CheckoutLinesInterface = getAddBundleToCartLines(
      bundlesData['data'],
      checkoutBundleLines,
    );
    if (!checkoutId) {
      return await this.createCheckoutFromBundleLines(
        userEmail,
        saleorLines,
        token,
      );
    }
    return await this.addLines(checkoutId, saleorLines, token);
  }
  public async updateBundleLines(
    userEmail: string,
    checkoutBundleLines: CheckoutLinesInterface,
    token: string,
  ) {
    const marketplaceCheckout =
      await this.marketplaceService.getAllCheckoutBundles(userEmail, token);
    const checkoutId = marketplaceCheckout['data']['checkoutId'];
    const checkoutLines = getUpdateCartBundleLines(
      marketplaceCheckout['data']['checkoutBundles'],
      checkoutBundleLines,
    );
    return await this.updateLines(checkoutId, checkoutLines, token);
  }

  public async removeBundleLines(
    checkoutId: string,
    checkoutBundlesData,
    token: string,
  ) {
    const saleorCheckout = await this.saleorCheckoutService.getCheckout(
      checkoutId,
      token,
    );
    const updatedSaleorLines = getDeleteBundlesLines(
      saleorCheckout['lines'],
      checkoutBundlesData,
    );
    return this.updateLines(checkoutId, updatedSaleorLines, token);
  }
}