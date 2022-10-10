import { Injectable, Logger } from '@nestjs/common';
import RecordNotFound from 'src/core/exceptions/recordNotFound';
import * as _ from 'src/graphql/handlers/checkout';
import { graphqlExceptionHandler } from 'src/public/graphqlHandler';
import {
  prepareFailedResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';

import * as ProductHandlers from 'src/graphql/handlers/product';
import * as UserHandlers from 'src/graphql/handlers/account';
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

import { AddressDetailTypes } from 'src/core/types/Checkout.types';

@Injectable()
export class CheckoutService {
  private readonly logger = new Logger(CheckoutService.name);

  public async getShoppingCartData(id: string): Promise<object> {
    try {
      let checkoutBundles = await _.getMarketplaceCheckoutHandler(id, true);
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
        UserHandlers.userByIdHandler(userId),
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
      const checkoutData = await _.getMarketplaceCheckoutHandler(userId, true);

      const saleorCheckout = await _.checkoutHandler(
        checkoutData['checkoutId'],
      );

      // FIXME: need to use promise all here,
      // but for that we need to think about exception handling
      // against each handler.
      await _.checkoutLinesDeleteHandler(
        saleorCheckout['lines'],
        checkoutData['bundles'],
        saleorCheckout['id'],
        checkoutBundleIds,
      );
      const response = await _.deleteCheckoutBundlesHandler(
        checkoutBundleIds,
        checkoutData['checkoutId'],
      );
      return prepareSuccessResponse(response, '', 201);
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

      const saleorCheckout = await _.checkoutHandler(
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
      const response = await _.addCheckoutBundlesHandler(
        checkoutData['checkoutId'],
        userId,
        bundlesFromCart,
      );
      return prepareSuccessResponse(response, '', 201);
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
      const checkoutData = await _.getMarketplaceCheckoutHandler(userId);
      const saleorCheckout = await _.checkoutHandler(
        checkoutData['checkoutId'],
      );
      await _.checkoutLinesAddHandler(
        checkoutData['checkoutId'],
        saleorCheckout['lines'],
        checkoutData['bundles'],
        bundleIds,
      );
      const updatedBundle = getUpdatedBundleForSelection(
        checkoutData['bundles'],
        bundleIds,
        true,
      );
      const response = await _.addCheckoutBundlesHandler(
        checkoutData['checkoutId'],
        userId,
        updatedBundle,
      );
      return prepareSuccessResponse(response, '', 201);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  public async setBundleAsUnselected(
    userId: string,
    bundleIds: Array<string>,
    checkoutBundleIds: Array<string>,
  ): Promise<object> {
    try {
      const checkoutData = await _.getMarketplaceCheckoutHandler(userId);
      const saleorCheckout = await _.checkoutHandler(
        checkoutData['checkoutId'],
      );
      await _.checkoutLinesDeleteHandler(
        saleorCheckout['lines'],
        checkoutData['bundles'],
        saleorCheckout['id'],
        checkoutBundleIds,
      );
      const updatedBundle = getUpdatedBundleForSelection(
        checkoutData['bundles'],
        bundleIds,
        false,
      );
      const response = await _.addCheckoutBundlesHandler(
        checkoutData['checkoutId'],
        userId,
        updatedBundle,
      );
      return prepareSuccessResponse(response, '', 201);
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

  public async getShippingBillingAddress(checkoutId: string): Promise<object> {
    try {
      const response = await _.shippingBillingAddress(checkoutId);
      return prepareSuccessResponse(response, '', 201);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  public async getShippingMethods(userId: string): Promise<object> {
    try {
      const checkoutData = await _.getMarketplaceCheckoutHandler(userId, false);

      const saleorCheckout = await _.checkoutHandler(
        checkoutData['checkoutId'],
      );
      const methodsListFromShopService = getShippingMethods(
        checkoutData['bundles'],
      );
      const methodsListFromSaleor = getShippingMethodsWithUUID(
        saleorCheckout['shippingMethods'],
        methodsListFromShopService,
        checkoutData['selectedMethods'],
      );

      return prepareSuccessResponse(methodsListFromSaleor, '', 201);
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
      const checkoutData = await _.getMarketplaceCheckoutHandler(userId, true);
      await Promise.all([
        _.addCheckoutShippingMethodHandler(
          checkoutData['checkoutId'],
          shippingIds,
          true,
        ),
        _.checkoutDeliveryMethodUpdateHandler(
          checkoutData['checkoutId'],
          checkoutData['selectedMethods'],
        ),
      ]);
      const response = await this.getShippingMethods(userId);
      return prepareSuccessResponse(response, '', 201);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  public async createPayment(userId: string): Promise<object> {
    try {
      const checkoutData = await _.getMarketplaceCheckoutHandler(userId);
      const paymentGateways = await _.getPaymentGatewaysHandler(
        checkoutData['checkoutId'],
      );
      const response = await _.createPaymentHandler(
        checkoutData['checkoutId'],
        paymentGateways['availablePaymentGateways'],
      );
      return prepareSuccessResponse(response, '', 201);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  public async checkoutComplete(userId: string): Promise<object> {
    try {
      const checkoutData = await _.getMarketplaceCheckoutHandler(userId);
      const selectedBundles = getSelectedBundles(checkoutData['bundles']);
      const checkoutBundleIds = getCheckoutBundleIds(selectedBundles);
      await _.deleteCheckoutBundlesHandler(
        checkoutBundleIds,
        checkoutData['checkoutId'],
        true,
      );
      const response = await _.checkoutCompleteHandler(
        checkoutData['checkoutId'],
      );
      return prepareSuccessResponse(response, '', 201);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }
}
