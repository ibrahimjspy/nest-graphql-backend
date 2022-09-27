import { Injectable } from '@nestjs/common';
import RecordNotFound from 'src/exceptions/recordNotFound';
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
import {
  prepareFailedResponse,
  prepareSuccessResponse,
} from 'src/utils/response';

@Injectable()
export class CheckoutService {
  public async getShoppingCartData(id: string): Promise<object> {
    try {
      return prepareSuccessResponse(
        await CheckoutHandlers.getMarketplaceCheckoutHandler(id, true),
      );
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
  }

  private async addToCartWhenCheckoutNotExists(
    userId,
    bundlesList,
    bundlesForCart,
  ) {
    const userData: any = await CheckoutHandlers.getUserHandler(userId);
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
  }

  public async addToCart(
    userId: string,
    bundlesForCart: Array<{ bundleId: string; quantity: number }>,
  ): Promise<object> {
    try {
      const bundlesList: any = await CheckoutHandlers.bundlesListHandler(
        bundlesForCart,
      );
      const checkoutData: any =
        await CheckoutHandlers.getMarketplaceCheckoutHandler(userId);

      const { checkoutId } = checkoutData || {};
      let response = {};

      if (checkoutId) {
        response = await this.addToCartWhenCheckoutExists(
          userId,
          checkoutData,
          bundlesList?.bundles,
          bundlesForCart,
        );
      } else {
        response = await this.addToCartWhenCheckoutNotExists(
          userId,
          bundlesList?.bundles,
          bundlesForCart,
        );
      }

      return prepareSuccessResponse(response);
    } catch (err) {
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
        await CheckoutHandlers.getMarketplaceCheckoutHandler(userId);
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
      const checkoutData: any =
        await CheckoutHandlers.getMarketplaceCheckoutHandler(userId);
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

  public async getShippingMethods(userId: string): Promise<object> {
    try {
      const checkoutData: any =
        await CheckoutHandlers.getMarketplaceCheckoutHandler(userId, false);
      const { checkoutId, selectedMethods, bundles } =
        checkoutData?.marketplaceCheckout;
      const saleorCheckout: any = await CheckoutHandlers.checkoutHandler(
        checkoutId,
      );

      // console.log({ checkout: saleorCheckout });

      const methodsListFromShopService = getShippingMethods(bundles);

      // console.log({ methodsListFromShopService });

      const methodsListFromSaleor = getShippingMethodsWithUUID(
        saleorCheckout?.checkout?.shippingMethods,
        methodsListFromShopService,
        selectedMethods,
      );

      // console.log({ methodsListFromSaleor });

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
      const checkoutData: any =
        await CheckoutHandlers.getMarketplaceCheckoutHandler(userId);
      await CheckoutHandlers.addCheckoutShippingMethodHandler(
        checkoutData,
        shippingIds,
      );
      await CheckoutHandlers.checkoutDeliveryMethodUpdateHandler(checkoutData);
      return this.getShippingMethods(userId);
    } catch (err) {
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
      return graphqlExceptionHandler(err);
    }
  }
}
