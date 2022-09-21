import { Injectable } from '@nestjs/common';
import {
  createCheckoutHandler,
  checkoutHandler,
  getCheckoutHandler,
  checkoutLinesUpdateHandler,
  shippingAddressHandler,
  billingAddressHandler,
  shippingBillingAddress,
  getShippingMethodHandler,
  createPaymentHandler,
  checkoutCompleteHandler,
  deleteCheckoutBundlesHandler,
  getPaymentGatewaysHandler,
  addCheckoutBundlesHandler,
  getUserHandler,
  addForCartHandler,
  bundlesListHandler,
  checkoutEmailUpdateHandler,
  addCheckoutShippingMethodHandler,
  checkoutDeliveryMethodUpdateHandler,
  checkoutLinesAddHandler,
  checkoutLinesDeleteHandler,
} from 'src/graphql/handlers/checkout';

import {
  getSelectedBundles,
  getCheckoutBundleIds,
  getTargetLineIds,
  updateBundlesQuantity,
  getUpdatedBundleForSelection,
  getUpdatedLinesWithQuantity,
} from 'src/public/checkoutHelperFunctions';
@Injectable()
export class CheckoutService {
  public getShoppingCartData(id: string): Promise<object> {
    return getCheckoutHandler(id);
  }

  public async addToCart(
    userId: string,
    bundlesForCart: Array<{ bundleId: string; quantity: number }>,
  ): Promise<object> {
    const bundlesList: any = await bundlesListHandler(bundlesForCart);
    const checkoutData: any = await getCheckoutHandler(userId);
    const { checkoutId, bundles } = checkoutData?.marketplaceCheckout || {};

    if (checkoutId) {
      await addForCartHandler(checkoutId, bundlesList?.bundles, bundlesForCart);
      // add checkout to shop service

      const bundlesWithUpdatedQuantity = updateBundlesQuantity(
        bundles,
        bundlesForCart,
      );
      // update quantity here
      return await addCheckoutBundlesHandler(
        checkoutId,
        userId,
        bundlesWithUpdatedQuantity,
      );
    } else {
      // create new checkout
      const newCheckout: any = await createCheckoutHandler(
        bundlesList?.bundles,
        bundlesForCart,
      );
      const newCheckoutId = newCheckout?.checkoutCreate?.checkout?.id;
      // add checkout to shop service
      if (newCheckoutId) {
        return await addCheckoutBundlesHandler(
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
    const checkoutData: any = await getCheckoutHandler(userId);
    const { checkoutId, bundles } = checkoutData?.marketplaceCheckout;
    const saleorCheckout: any = await checkoutHandler(checkoutId);
    const targetLineIds = getTargetLineIds(
      saleorCheckout,
      bundles,
      checkoutBundleIds,
    );
    await checkoutLinesDeleteHandler(targetLineIds);
    return await deleteCheckoutBundlesHandler(checkoutBundleIds, checkoutId);
  }

  public async updateBundleFromCart(
    userId: string,
    bundlesFromCart: Array<{ bundleId: string; quantity: number }>,
  ): Promise<object> {
    const checkoutData: any = await getCheckoutHandler(userId);
    const { checkoutId, bundles } = checkoutData?.marketplaceCheckout;
    const saleorCheckout: any = await checkoutHandler(checkoutId);

    const updatedLinesWithQuantity = getUpdatedLinesWithQuantity(
      saleorCheckout,
      bundles,
      bundlesFromCart,
    );
    await checkoutLinesUpdateHandler(checkoutId, updatedLinesWithQuantity);
    return addCheckoutBundlesHandler(checkoutId, userId, bundlesFromCart);
  }

  public async setBundleAsSelected(
    userId: string,
    bundleIds: Array<string>,
  ): Promise<object> {
    const checkoutData: any = await getCheckoutHandler(userId);
    const { checkoutId, bundles } = checkoutData?.marketplaceCheckout || {};
    const saleorCheckout: any = await checkoutHandler(checkoutId);
    await checkoutLinesAddHandler(
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
    return addCheckoutBundlesHandler(checkoutId, userId, updatedBundle);
  }

  public async setBundleAsUnselected(
    userId: string,
    bundleIds: Array<string>,
  ): Promise<object> {
    const checkoutData: any = await getCheckoutHandler(userId);
    const { checkoutId, bundles } = checkoutData?.marketplaceCheckout || {};
    const saleorCheckout: any = await checkoutHandler(checkoutId);
    const lineIds = getTargetLineIds(saleorCheckout, bundles, bundleIds);
    await checkoutLinesDeleteHandler(lineIds);
    const updatedBundle = getUpdatedBundleForSelection(
      bundles,
      bundleIds,
      false,
    );
    return addCheckoutBundlesHandler(checkoutId, userId, updatedBundle);
  }

  public addShippingAddress(checkoutId, addressDetails): Promise<object> {
    return shippingAddressHandler(checkoutId, addressDetails);
  }

  public addBillingAddress(checkoutId, addressDetails): Promise<object> {
    return billingAddressHandler(checkoutId, addressDetails);
  }

  public getShippingBillingAddress(checkoutId: string): Promise<object> {
    return shippingBillingAddress(checkoutId);
  }

  public async getShippingMethod(userId: string): Promise<object> {
    return getShippingMethodHandler(userId);
  }

  public async selectShippingMethods(
    userId: string,
    shippingIds: Array<string>,
  ): Promise<object> {
    const checkoutData: any = await getCheckoutHandler(userId);
    const { checkoutId, selectedMethods } = checkoutData?.marketplaceCheckout;
    const deliveryMethodId = selectedMethods[0]?.method?.shippingMethodId;
    await addCheckoutShippingMethodHandler(checkoutId, shippingIds);
    await checkoutDeliveryMethodUpdateHandler(checkoutId, deliveryMethodId);
    return getShippingMethodHandler(userId);
  }

  public async createPayment(userId: string): Promise<object> {
    const checkoutData: any = await getCheckoutHandler(userId);
    const { checkoutId } = checkoutData?.marketplaceCheckout;
    const paymentGateways: any = await getPaymentGatewaysHandler(checkoutId);
    const userData: any = await getUserHandler(userId);
    await checkoutEmailUpdateHandler(checkoutId, userData?.user?.email);
    return createPaymentHandler(paymentGateways, checkoutId);
  }

  public async checkoutComplete(userId: string): Promise<object> {
    const checkoutData: any = await getCheckoutHandler(userId);
    const { checkoutId, bundles } = checkoutData?.marketplaceCheckout;
    const selectedBundles = getSelectedBundles(bundles);
    const checkoutBundleIds = getCheckoutBundleIds(selectedBundles);
    await deleteCheckoutBundlesHandler(checkoutBundleIds, checkoutId);
    return checkoutCompleteHandler(checkoutId);
  }
}
