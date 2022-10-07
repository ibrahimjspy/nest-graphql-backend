import { Injectable, Logger } from '@nestjs/common';
import RecordNotFound from 'src/core/exceptions/recordNotFound';
import { graphqlExceptionHandler } from 'src/public/graphqlHandler';
import {
  prepareFailedResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';

import * as CheckoutHandlers from 'src/graphql/handlers/checkout';
import * as ProductHandlers from 'src/graphql/handlers/product';
import * as CheckoutUtils from './Checkout.utils';
import {
  getSelectedBundles,
  getShippingMethods,
  getCheckoutBundleIds,
  updateBundlesQuantity,
  getShippingMethodsWithUUID,
  getUpdatedBundleForSelection,
  getUpdatedLinesWithQuantity,
} from 'src/public/checkoutHelperFunctions';

@Injectable()
export class CheckoutService {
  private readonly logger = new Logger(CheckoutService.name);

  public async getShoppingCartData(id: string): Promise<object> {
    try {
      let checkoutBundles =
        await CheckoutHandlers.getMarketplaceCheckoutHandler(id, true);
      const productIds = CheckoutUtils.getProductIdsByCheckoutBundles(
        checkoutBundles['bundles'],
      );
      const variantIds = CheckoutUtils.getVariantsIdsByProducts(
        await ProductHandlers.variantsIdsByProductIdsHandler(productIds),
      );
      const allBundles = await ProductHandlers.bundlesByVariantsIdsHandler(
        variantIds,
      );

      checkoutBundles['bundles'] = checkoutBundles['bundles']?.concat(
        CheckoutUtils.getBundlesNotInCheckout(
          checkoutBundles['bundles'],
          allBundles,
        ),
      );

      return prepareSuccessResponse(checkoutBundles);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  private async addToCartWhenCheckoutExists(
    userId,
    checkoutData,
    bundlesList,
    bundlesForCart,
  ) {
    const { checkoutId, bundles } = checkoutData;
    const bundlesWithUpdatedQuantity = updateBundlesQuantity(
      bundles,
      bundlesForCart,
    );

    // FIXME: need to use promise all here,
    // but for that we need to think about exception handling
    // against each handler.
    await CheckoutHandlers.addForCartHandler(
      checkoutId,
      bundlesList,
      bundlesForCart,
    );
    return await CheckoutHandlers.addCheckoutBundlesHandler(
      checkoutId,
      userId,
      bundlesWithUpdatedQuantity,
    );
  }

  private async addToCartWhenCheckoutNotExists(
    userData,
    bundlesList,
    bundlesForCart,
  ) {
    const newCheckout: any = await CheckoutHandlers.createCheckoutHandler(
      userData?.email,
      bundlesList,
      bundlesForCart,
    );

    const newCheckoutId = newCheckout?.checkout?.id;
    return await CheckoutHandlers.addCheckoutBundlesHandler(
      newCheckoutId,
      userData?.id,
      bundlesForCart,
    );
  }

  public async addToCart(
    userId: string,
    bundlesForCart: Array<{ bundleId: string; quantity: number }>,
  ): Promise<object> {
    try {
      const [userData, bundlesList, checkoutData] = await Promise.all([
        CheckoutHandlers.getUserHandler(userId),
        CheckoutHandlers.bundlesListHandler(bundlesForCart),
        CheckoutHandlers.getMarketplaceCheckoutHandler(userId),
      ]);

      let response = {};
      if (checkoutData['checkoutId']) {
        response = await this.addToCartWhenCheckoutExists(
          userId,
          checkoutData,
          bundlesList['bundles'],
          bundlesForCart,
        );
      } else {
        response = await this.addToCartWhenCheckoutNotExists(
          userData,
          bundlesList['bundles'],
          bundlesForCart,
        );
      }
      return prepareSuccessResponse(response, '', 201);
    } catch (err) {
      this.logger.error(err);
      if (err instanceof RecordNotFound) {
        return prepareFailedResponse(err.message);
      }
      return graphqlExceptionHandler(err);
    }
  }

  public async deleteBundleFromCart(
    userId: string,
    checkoutBundleIds: Array<string>,
  ): Promise<object> {
    try {
      const checkoutData: any =
        await CheckoutHandlers.getMarketplaceCheckoutHandler(userId, true);

      const { checkoutId, bundles } = checkoutData;
      const saleorCheckout: any = await CheckoutHandlers.checkoutHandler(
        checkoutId,
      );

      // FIXME: need to use promise all here,
      // but for that we need to think about exception handling
      // against each handler.
      await CheckoutHandlers.checkoutLinesDeleteHandler(
        saleorCheckout,
        bundles,
        checkoutBundleIds,
      );
      return await CheckoutHandlers.deleteCheckoutBundlesHandler(
        checkoutBundleIds,
        checkoutId,
      );
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  public async updateBundleFromCart(
    userId: string,
    bundlesFromCart: Array<{ bundleId: string; quantity: number }>,
  ): Promise<object> {
    try {
      const checkoutData = await CheckoutHandlers.getMarketplaceCheckoutHandler(
        userId,
        true,
      );

      const saleorCheckout: any = await CheckoutHandlers.checkoutHandler(
        checkoutData['checkoutId'],
      );

      const updatedLinesWithQuantity = getUpdatedLinesWithQuantity(
        saleorCheckout['lines'],
        checkoutData['bundles'],
        bundlesFromCart,
      );

      // FIXME: need to use promise all here,
      // but for that we need to think about exception handling
      // against each handler.
      await CheckoutHandlers.checkoutLinesUpdateHandler(
        checkoutData['checkoutId'],
        updatedLinesWithQuantity,
      );
      return CheckoutHandlers.addCheckoutBundlesHandler(
        checkoutData['checkoutId'],
        userId,
        bundlesFromCart,
      );
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  public async setBundleAsSelected(
    userId: string,
    bundleIds: Array<string>,
  ): Promise<object> {
    try {
      const checkoutData: any =
        await CheckoutHandlers.getMarketplaceCheckoutHandler(userId);
      const { checkoutId, bundles } = checkoutData?.marketplaceCheckout || {};
      const saleorCheckout: any = await CheckoutHandlers.checkoutHandler(
        checkoutId,
      );
      await CheckoutHandlers.checkoutLinesAddHandler(
        checkoutId,
        saleorCheckout,
        bundles,
        bundleIds,
      );
      const updatedBundle = getUpdatedBundleForSelection(
        bundles,
        bundleIds,
        true,
      );
      return CheckoutHandlers.addCheckoutBundlesHandler(
        checkoutId,
        userId,
        updatedBundle,
      );
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  public async setBundleAsUnselected(
    userId: string,
    bundleIds: Array<string>,
  ): Promise<object> {
    try {
      const checkoutData: any =
        await CheckoutHandlers.getMarketplaceCheckoutHandler(userId);
      const { checkoutId, bundles } = checkoutData?.marketplaceCheckout || {};
      const saleorCheckout: any = await CheckoutHandlers.checkoutHandler(
        checkoutId,
      );
      await CheckoutHandlers.checkoutLinesDeleteHandler(
        saleorCheckout,
        bundles,
        bundleIds,
      );
      const updatedBundle = getUpdatedBundleForSelection(
        bundles,
        bundleIds,
        false,
      );
      return CheckoutHandlers.addCheckoutBundlesHandler(
        checkoutId,
        userId,
        updatedBundle,
      );
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  public addShippingAddress(
    checkoutId: string,
    addressDetails,
  ): Promise<object> {
    try {
      return CheckoutHandlers.shippingAddressHandler(
        checkoutId,
        addressDetails,
      );
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  public addBillingAddress(
    checkoutId: string,
    addressDetails,
  ): Promise<object> {
    try {
      return CheckoutHandlers.billingAddressHandler(checkoutId, addressDetails);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  public getShippingBillingAddress(checkoutId: string): Promise<object> {
    try {
      return CheckoutHandlers.shippingBillingAddress(checkoutId);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  public async getShippingMethods(userId: string): Promise<object> {
    try {
      const checkoutData: any =
        await CheckoutHandlers.getMarketplaceCheckoutHandler(userId, false);
      const { checkoutId, selectedMethods, bundles } =
        checkoutData?.marketplaceCheckout;
      const saleorCheckout: any = await CheckoutHandlers.checkoutHandler(
        checkoutId,
      );
      const methodsListFromShopService = getShippingMethods(bundles);
      const methodsListFromSaleor = getShippingMethodsWithUUID(
        saleorCheckout?.checkout?.shippingMethods,
        methodsListFromShopService,
        selectedMethods,
      );

      return methodsListFromSaleor;
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  public async selectShippingMethods(
    userId: string,
    shippingIds: Array<string>,
  ): Promise<object> {
    try {
      const checkoutData: any =
        await CheckoutHandlers.getMarketplaceCheckoutHandler(userId);
      await CheckoutHandlers.addCheckoutShippingMethodHandler(
        checkoutData,
        shippingIds,
      );
      await CheckoutHandlers.checkoutDeliveryMethodUpdateHandler(checkoutData);
      return this.getShippingMethods(userId);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  public async createPayment(userId: string): Promise<object> {
    try {
      const checkoutData: any =
        await CheckoutHandlers.getMarketplaceCheckoutHandler(userId);
      const paymentGateways: any =
        await CheckoutHandlers.getPaymentGatewaysHandler(checkoutData);
      return CheckoutHandlers.createPaymentHandler(
        checkoutData,
        paymentGateways,
      );
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  public async checkoutComplete(userId: string): Promise<object> {
    try {
      const checkoutData: any =
        await CheckoutHandlers.getMarketplaceCheckoutHandler(userId);
      const { checkoutId, bundles } = checkoutData?.marketplaceCheckout;
      const selectedBundles = getSelectedBundles(bundles);
      const checkoutBundleIds = getCheckoutBundleIds(selectedBundles);
      await CheckoutHandlers.deleteCheckoutBundlesHandler(
        checkoutBundleIds,
        checkoutId,
      );
      return CheckoutHandlers.checkoutCompleteHandler(checkoutId);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }
}
