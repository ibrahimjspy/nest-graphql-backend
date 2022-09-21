import { Injectable } from '@nestjs/common';
import * as CheckoutHandlers from 'src/graphql/handlers/checkout';

import {
  getSelectedBundles,
  getCheckoutBundleIds,
  updateBundlesQuantity,
  getUpdatedBundleForSelection,
  getUpdatedLinesWithQuantity,
} from 'src/public/checkoutHelperFunctions';
@Injectable()
export class CheckoutService {
  public getShoppingCartData(id: string): Promise<object> {
    return CheckoutHandlers.getCheckoutHandler(id);
  }

  public async addToCart(
    userId: string,
    bundlesForCart: Array<{ bundleId: string; quantity: number }>,
  ): Promise<object> {
    const bundlesList: any = await CheckoutHandlers.bundlesListHandler(
      bundlesForCart,
    );
    const checkoutData: any = await CheckoutHandlers.getCheckoutHandler(userId);
    const { checkoutId, bundles } = checkoutData?.marketplaceCheckout || {};

    if (checkoutId) {
      await CheckoutHandlers.addForCartHandler(
        checkoutId,
        bundlesList?.bundles,
        bundlesForCart,
      );
      // add checkout to shop service

      const bundlesWithUpdatedQuantity = updateBundlesQuantity(
        bundles,
        bundlesForCart,
      );
      // update quantity here
      return await CheckoutHandlers.addCheckoutBundlesHandler(
        checkoutId,
        userId,
        bundlesWithUpdatedQuantity,
      );
    } else {
      // create new checkout
      const newCheckout: any = await CheckoutHandlers.createCheckoutHandler(
        bundlesList?.bundles,
        bundlesForCart,
      );
      const newCheckoutId = newCheckout?.checkoutCreate?.checkout?.id;
      // add checkout to shop service
      if (newCheckoutId) {
        return await CheckoutHandlers.addCheckoutBundlesHandler(
          newCheckoutId,
          userId,
          bundlesForCart,
        );
      }
    }
  }

  public async deleteBundleFromCart(
    userId: string,
    checkoutBundleIds: Array<string>,
  ): Promise<object> {
    const checkoutData: any = await CheckoutHandlers.getCheckoutHandler(userId);
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
  }

  public async updateBundleFromCart(
    userId: string,
    bundlesFromCart: Array<{ bundleId: string; quantity: number }>,
  ): Promise<object> {
    const checkoutData: any = await CheckoutHandlers.getCheckoutHandler(userId);
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
  }

  public async setBundleAsSelected(
    userId: string,
    bundleIds: Array<string>,
  ): Promise<object> {
    const checkoutData: any = await CheckoutHandlers.getCheckoutHandler(userId);
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
  }

  public async setBundleAsUnselected(
    userId: string,
    bundleIds: Array<string>,
  ): Promise<object> {
    const checkoutData: any = await CheckoutHandlers.getCheckoutHandler(userId);
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
  }

  public addShippingAddress(checkoutId, addressDetails): Promise<object> {
    return CheckoutHandlers.shippingAddressHandler(checkoutId, addressDetails);
  }

  public addBillingAddress(checkoutId, addressDetails): Promise<object> {
    return CheckoutHandlers.billingAddressHandler(checkoutId, addressDetails);
  }

  public getShippingBillingAddress(checkoutId: string): Promise<object> {
    return CheckoutHandlers.shippingBillingAddress(checkoutId);
  }

  public async getShippingMethod(userId: string): Promise<object> {
    return CheckoutHandlers.getShippingMethodHandler(userId);
  }

  public async selectShippingMethods(
    userId: string,
    shippingIds: Array<string>,
  ): Promise<object> {
    const checkoutData: any = await CheckoutHandlers.getCheckoutHandler(userId);
    await CheckoutHandlers.addCheckoutShippingMethodHandler(
      checkoutData,
      shippingIds,
    );
    await CheckoutHandlers.checkoutDeliveryMethodUpdateHandler(checkoutData);
    return CheckoutHandlers.getShippingMethodHandler(userId);
  }

  public async createPayment(userId: string): Promise<object> {
    const checkoutData: any = await CheckoutHandlers.getCheckoutHandler(userId);
    const userData: any = await CheckoutHandlers.getUserHandler(userId);
    const paymentGateways: any =
      await CheckoutHandlers.getPaymentGatewaysHandler(checkoutData);
    await CheckoutHandlers.checkoutEmailUpdateHandler(checkoutData, userData);
    return CheckoutHandlers.createPaymentHandler(checkoutData, paymentGateways);
  }

  public async checkoutComplete(userId: string): Promise<object> {
    const checkoutData: any = await CheckoutHandlers.getCheckoutHandler(userId);
    const { checkoutId, bundles } = checkoutData?.marketplaceCheckout;
    const selectedBundles = getSelectedBundles(bundles);
    const checkoutBundleIds = getCheckoutBundleIds(selectedBundles);
    await CheckoutHandlers.deleteCheckoutBundlesHandler(
      checkoutBundleIds,
      checkoutId,
    );
    return CheckoutHandlers.checkoutCompleteHandler(checkoutId);
  }
}
