import { Injectable } from '@nestjs/common';
import * as CheckoutHandlers from 'src/graphql/handlers/checkout';

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
@Injectable()
export class CheckoutService {
  public getShoppingCartData(id: string): Promise<object> {
    try {
      return CheckoutHandlers.getCheckoutHandler(id);
    } catch (err) {
      return graphqlExceptionHandler(err);
    }
  }

  private async addToCartWhenCheckoutExists(
    userId,
    checkoutData,
    bundlesList,
    bundlesForCart,
  ) {
    try {
      const { checkoutId, bundles } = checkoutData?.marketplaceCheckout || {};
      await CheckoutHandlers.addForCartHandler(
        checkoutId,
        bundlesList,
        bundlesForCart,
      );
      const bundlesWithUpdatedQuantity = updateBundlesQuantity(
        bundles,
        bundlesForCart,
      );
      return await CheckoutHandlers.addCheckoutBundlesHandler(
        checkoutId,
        userId,
        bundlesWithUpdatedQuantity,
      );
    } catch (err) {
      return graphqlExceptionHandler(err);
    }
  }

  private async addToCartWhenCheckoutNotExists(
    userId,
    bundlesList,
    bundlesForCart,
  ) {
    try {
      const newCheckout: any = await CheckoutHandlers.createCheckoutHandler(
        bundlesList,
        bundlesForCart,
      );
      const newCheckoutId = newCheckout?.checkoutCreate?.checkout?.id;
      return await CheckoutHandlers.addCheckoutBundlesHandler(
        newCheckoutId,
        userId,
        bundlesForCart,
      );
    } catch (err) {
      return graphqlExceptionHandler(err);
    }
  }

  public async addToCart(
    userId: string,
    bundlesForCart: Array<{ bundleId: string; quantity: number }>,
  ): Promise<object> {
    try {
      const bundlesList: any = await CheckoutHandlers.bundlesListHandler(
        bundlesForCart,
      );
      const checkoutData: any = await CheckoutHandlers.getCheckoutHandler(
        userId,
      );
      const { checkoutId } = checkoutData?.marketplaceCheckout || {};
      if (checkoutId) {
        return await this.addToCartWhenCheckoutExists(
          userId,
          checkoutData,
          bundlesList?.bundles,
          bundlesForCart,
        );
      } else {
        return await this.addToCartWhenCheckoutNotExists(
          userId,
          bundlesList?.bundles,
          bundlesForCart,
        );
      }
    } catch (err) {
      return graphqlExceptionHandler(err);
    }
  }

  public async deleteBundleFromCart(
    userId: string,
    checkoutBundleIds: Array<string>,
  ): Promise<object> {
    try {
      const checkoutData: any = await CheckoutHandlers.getCheckoutHandler(
        userId,
      );
      const { checkoutId, bundles } = checkoutData?.marketplaceCheckout;
      const saleorCheckout: any = await CheckoutHandlers.checkoutHandler(
        checkoutId,
      );
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
      return graphqlExceptionHandler(err);
    }
  }

  public async updateBundleFromCart(
    userId: string,
    bundlesFromCart: Array<{ bundleId: string; quantity: number }>,
  ): Promise<object> {
    try {
      const checkoutData: any = await CheckoutHandlers.getCheckoutHandler(
        userId,
      );
      const { checkoutId, bundles } = checkoutData?.marketplaceCheckout;
      const saleorCheckout: any = await CheckoutHandlers.checkoutHandler(
        checkoutId,
      );

      const updatedLinesWithQuantity = getUpdatedLinesWithQuantity(
        saleorCheckout,
        bundles,
        bundlesFromCart,
      );
      await CheckoutHandlers.checkoutLinesUpdateHandler(
        checkoutId,
        updatedLinesWithQuantity,
      );
      return CheckoutHandlers.addCheckoutBundlesHandler(
        checkoutId,
        userId,
        bundlesFromCart,
      );
    } catch (err) {
      return graphqlExceptionHandler(err);
    }
  }

  public async setBundleAsSelected(
    userId: string,
    bundleIds: Array<string>,
  ): Promise<object> {
    try {
      const checkoutData: any = await CheckoutHandlers.getCheckoutHandler(
        userId,
      );
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
      return graphqlExceptionHandler(err);
    }
  }

  public async setBundleAsUnselected(
    userId: string,
    bundleIds: Array<string>,
  ): Promise<object> {
    try {
      const checkoutData: any = await CheckoutHandlers.getCheckoutHandler(
        userId,
      );
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
      return graphqlExceptionHandler(err);
    }
  }

  public getShippingBillingAddress(checkoutId: string): Promise<object> {
    try {
      return CheckoutHandlers.shippingBillingAddress(checkoutId);
    } catch (err) {
      return graphqlExceptionHandler(err);
    }
  }

  public async getShippingMethod(userId: string): Promise<object> {
    try {
      const checkoutData: any = await CheckoutHandlers.getCheckoutHandler(
        userId,
      );
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
      return graphqlExceptionHandler(err);
    }
  }

  public async selectShippingMethods(
    userId: string,
    shippingIds: Array<string>,
  ): Promise<object> {
    try {
      const checkoutData: any = await CheckoutHandlers.getCheckoutHandler(
        userId,
      );
      await CheckoutHandlers.addCheckoutShippingMethodHandler(
        checkoutData,
        shippingIds,
      );
      await CheckoutHandlers.checkoutDeliveryMethodUpdateHandler(checkoutData);
      return this.getShippingMethod(userId);
    } catch (err) {
      return graphqlExceptionHandler(err);
    }
  }

  public async createPayment(userId: string): Promise<object> {
    try {
      const checkoutData: any = await CheckoutHandlers.getCheckoutHandler(
        userId,
      );
      const userData: any = await CheckoutHandlers.getUserHandler(userId);
      const paymentGateways: any =
        await CheckoutHandlers.getPaymentGatewaysHandler(checkoutData);
      await CheckoutHandlers.checkoutEmailUpdateHandler(checkoutData, userData);
      return CheckoutHandlers.createPaymentHandler(
        checkoutData,
        paymentGateways,
      );
    } catch (err) {
      return graphqlExceptionHandler(err);
    }
  }

  public async checkoutComplete(userId: string): Promise<object> {
    try {
      const checkoutData: any = await CheckoutHandlers.getCheckoutHandler(
        userId,
      );
      const { checkoutId, bundles } = checkoutData?.marketplaceCheckout;
      const selectedBundles = getSelectedBundles(bundles);
      const checkoutBundleIds = getCheckoutBundleIds(selectedBundles);
      await CheckoutHandlers.deleteCheckoutBundlesHandler(
        checkoutBundleIds,
        checkoutId,
      );
      return CheckoutHandlers.checkoutCompleteHandler(checkoutId);
    } catch (err) {
      return graphqlExceptionHandler(err);
    }
  }
}
