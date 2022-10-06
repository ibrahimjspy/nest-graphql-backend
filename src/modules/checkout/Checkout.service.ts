import { Injectable, Logger } from '@nestjs/common';
import RecordNotFound from 'src/core/exceptions/recordNotFound';
import * as _ from 'src/graphql/handlers/checkout';

import {
  getSelectedBundles,
  getShippingMethods,
  getCheckoutBundleIds,
  updateBundlesQuantity,
  getShippingMethodsWithUUID,
  getUpdatedBundleForSelection,
  getUpdatedLinesWithQuantity,
} from 'src/public/checkoutHelperFunctions';
import { graphqlExceptionHandler } from 'src/public/graphqlHandler';
import {
  prepareFailedResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';

import { AddressDetailTypes } from 'src/core/types/Checkout.types';

@Injectable()
export class CheckoutService {
  private readonly logger = new Logger(CheckoutService.name);

  public async getShoppingCartData(id: string): Promise<object> {
    try {
      return prepareSuccessResponse(
        await _.getMarketplaceCheckoutHandler(id, true),
      );
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
    await _.addForCartHandler(checkoutId, bundlesList, bundlesForCart);
    return await _.addCheckoutBundlesHandler(
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
    const newCheckout: any = await _.createCheckoutHandler(
      userData?.email,
      bundlesList,
      bundlesForCart,
    );

    const newCheckoutId = newCheckout?.checkout?.id;
    return await _.addCheckoutBundlesHandler(
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
        _.getUserHandler(userId),
        _.bundlesListHandler(bundlesForCart),
        _.getMarketplaceCheckoutHandler(userId),
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
      const checkoutData: any = await _.getMarketplaceCheckoutHandler(
        userId,
        true,
      );

      const { checkoutId, bundles } = checkoutData;
      const saleorCheckout: any = await _.checkoutHandler(checkoutId);

      // FIXME: need to use promise all here,
      // but for that we need to think about exception handling
      // against each handler.
      await _.checkoutLinesDeleteHandler(
        saleorCheckout,
        bundles,
        checkoutBundleIds,
      );
      return await _.deleteCheckoutBundlesHandler(
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
      const checkoutData = await _.getMarketplaceCheckoutHandler(userId, true);

      const saleorCheckout: any = await _.checkoutHandler(
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
      await _.checkoutLinesUpdateHandler(
        checkoutData['checkoutId'],
        updatedLinesWithQuantity,
      );
      return _.addCheckoutBundlesHandler(
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
      const checkoutData: any = await _.getMarketplaceCheckoutHandler(userId);
      const { checkoutId, bundles } = checkoutData?.marketplaceCheckout || {};
      const saleorCheckout: any = await _.checkoutHandler(checkoutId);
      await _.checkoutLinesAddHandler(
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
      return _.addCheckoutBundlesHandler(checkoutId, userId, updatedBundle);
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
      const checkoutData: any = await _.getMarketplaceCheckoutHandler(userId);
      const { checkoutId, bundles } = checkoutData?.marketplaceCheckout || {};
      const saleorCheckout: any = await _.checkoutHandler(checkoutId);
      await _.checkoutLinesDeleteHandler(saleorCheckout, bundles, bundleIds);
      const updatedBundle = getUpdatedBundleForSelection(
        bundles,
        bundleIds,
        false,
      );
      return _.addCheckoutBundlesHandler(checkoutId, userId, updatedBundle);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  public async addShippingAddress(
    checkoutId: string,
    addressDetails: AddressDetailTypes,
  ): Promise<object> {
    try {
      const response = await _.shippingAddressUpdateHandler(
        checkoutId,
        addressDetails,
      );
      return prepareSuccessResponse(response, '', 201);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  public async addBillingAddress(
    checkoutId: string,
    addressDetails: AddressDetailTypes,
  ): Promise<object> {
    try {
      const response = await _.billingAddressUpdateHandler(
        checkoutId,
        addressDetails,
      );
      return prepareSuccessResponse(response, '', 201);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  public getShippingBillingAddress(checkoutId: string): Promise<object> {
    try {
      return _.shippingBillingAddress(checkoutId);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  public async getShippingMethods(userId: string): Promise<object> {
    try {
      const checkoutData: any = await _.getMarketplaceCheckoutHandler(
        userId,
        false,
      );
      const { checkoutId, selectedMethods, bundles } =
        checkoutData?.marketplaceCheckout;
      const saleorCheckout: any = await _.checkoutHandler(checkoutId);
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
      const checkoutData: any = await _.getMarketplaceCheckoutHandler(userId);
      await _.addCheckoutShippingMethodHandler(checkoutData, shippingIds);
      await _.checkoutDeliveryMethodUpdateHandler(checkoutData);
      return this.getShippingMethods(userId);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  public async createPayment(userId: string): Promise<object> {
    try {
      const checkoutData: any = await _.getMarketplaceCheckoutHandler(userId);
      const paymentGateways: any = await _.getPaymentGatewaysHandler(
        checkoutData,
      );
      return _.createPaymentHandler(checkoutData, paymentGateways);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  public async checkoutComplete(userId: string): Promise<object> {
    try {
      const checkoutData: any = await _.getMarketplaceCheckoutHandler(userId);
      const { checkoutId, bundles } = checkoutData?.marketplaceCheckout;
      const selectedBundles = getSelectedBundles(bundles);
      const checkoutBundleIds = getCheckoutBundleIds(selectedBundles);
      await _.deleteCheckoutBundlesHandler(checkoutBundleIds, checkoutId);
      return _.checkoutCompleteHandler(checkoutId);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }
}
