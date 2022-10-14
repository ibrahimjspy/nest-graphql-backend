import { Injectable, Logger } from '@nestjs/common';
import RecordNotFound from 'src/core/exceptions/recordNotFound';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import {
  prepareFailedResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';

import * as CheckoutHandlers from 'src/graphql/handlers/checkout';
import * as ProductHandlers from 'src/graphql/handlers/product';
import * as AccountHandlers from 'src/graphql/handlers/account';
import * as CheckoutUtils from './Checkout.utils';

import {
  AddressDetailType,
  BundleType,
} from 'src/graphql/handlers/checkout.type';

@Injectable()
export class CheckoutService {
  private readonly logger = new Logger(CheckoutService.name);

  public async getShoppingCartData(id: string): Promise<object> {
    try {
      const checkoutBundles = await CheckoutHandlers.marketplaceCheckoutHandler(
        id,
        true,
      );
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
    const bundlesWithUpdatedQuantity = CheckoutUtils.updateBundlesQuantity(
      bundles,
      bundlesForCart,
    );

    // FIXME: need to use promise all here,
    // but for that we need to think about exception handling
    // against each handler.
    const checkoutLines = CheckoutUtils.getLineItems(
      bundlesList,
      bundlesForCart,
    );
    await CheckoutHandlers.addLinesHandler(checkoutId, checkoutLines);
    return await CheckoutHandlers.addBundlesHandler(
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
    const checkoutLines = CheckoutUtils.getLineItems(
      bundlesList,
      bundlesForCart,
    );
    const newCheckout: any = await CheckoutHandlers.createCheckoutHandler(
      userData?.email,
      checkoutLines,
    );

    const newCheckoutId = newCheckout?.checkout?.id;
    return await CheckoutHandlers.addBundlesHandler(
      newCheckoutId,
      userData?.id,
      bundlesForCart,
    );
  }

  public async addToCart(
    userId: string,
    bundlesForCart: Array<BundleType>,
  ): Promise<object> {
    try {
      const [userData, bundlesList, checkoutData] = await Promise.all([
        AccountHandlers.userEmailByIdHandler(userId),
        ProductHandlers.bundlesByBundleIdsHandler(bundlesForCart),
        CheckoutHandlers.marketplaceCheckoutHandler(userId),
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
      const checkoutData = await CheckoutHandlers.marketplaceCheckoutHandler(
        userId,
        true,
      );

      const saleorCheckout = await CheckoutHandlers.checkoutHandler(
        checkoutData['checkoutId'],
      );

      // FIXME: need to use promise all here,
      // but for that we need to think about exception handling
      // against each handler.
      const checkoutLines = CheckoutUtils.getCheckoutLineItems(
        saleorCheckout['lines'],
        checkoutData['bundles'],
        checkoutBundleIds,
      );
      const checkoutLineIds = CheckoutUtils.getCheckoutLineIds(checkoutLines);

      await CheckoutHandlers.deleteLinesHandler(
        saleorCheckout['id'],
        checkoutLineIds,
      );
      const response = await CheckoutHandlers.deleteBundlesHandler(
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
    bundlesFromCart: Array<BundleType>,
  ): Promise<object> {
    try {
      const checkoutData = await CheckoutHandlers.marketplaceCheckoutHandler(
        userId,
        true,
      );

      const saleorCheckout = await CheckoutHandlers.checkoutHandler(
        checkoutData['checkoutId'],
      );

      const updatedLinesWithQuantity =
        CheckoutUtils.getUpdatedLinesWithQuantity(
          saleorCheckout['lines'],
          checkoutData['bundles'],
          bundlesFromCart,
        );

      // FIXME: need to use promise all here,
      // but for that we need to think about exception handling
      // against each handler.
      await CheckoutHandlers.updateLinesHandler(
        checkoutData['checkoutId'],
        updatedLinesWithQuantity,
      );
      const response = await CheckoutHandlers.addBundlesHandler(
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
      const checkoutData = await CheckoutHandlers.marketplaceCheckoutHandler(
        userId,
      );
      const saleorCheckout = await CheckoutHandlers.checkoutHandler(
        checkoutData['checkoutId'],
      );
      const checkoutLines = CheckoutUtils.getCheckoutLineItems(
        saleorCheckout['lines'],
        checkoutData['bundles'],
        bundleIds,
      );
      await CheckoutHandlers.addLinesHandler(
        checkoutData['checkoutId'],
        checkoutLines,
      );
      const selectedBundles = CheckoutUtils.selectOrUnselectBundle(
        checkoutData['bundles'],
        bundleIds,
        true,
      );
      const response = await CheckoutHandlers.addBundlesHandler(
        checkoutData['checkoutId'],
        userId,
        selectedBundles,
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
      const checkoutData = await CheckoutHandlers.marketplaceCheckoutHandler(
        userId,
      );
      const saleorCheckout = await CheckoutHandlers.checkoutHandler(
        checkoutData['checkoutId'],
      );
      const checkoutLines = CheckoutUtils.getCheckoutLineItems(
        saleorCheckout['lines'],
        checkoutData['bundles'],
        checkoutBundleIds,
      );

      const checkoutLineIds = CheckoutUtils.getCheckoutLineIds(checkoutLines);

      await CheckoutHandlers.deleteLinesHandler(
        checkoutLineIds,
        saleorCheckout['id'],
      );
      const updatedBundle = CheckoutUtils.selectOrUnselectBundle(
        checkoutData['bundles'],
        bundleIds,
        false,
      );
      const response = await CheckoutHandlers.addBundlesHandler(
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
    addressDetails: AddressDetailType,
  ): Promise<object> {
    try {
      const response = await CheckoutHandlers.shippingAddressUpdateHandler(
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
    addressDetails: AddressDetailType,
  ): Promise<object> {
    try {
      const response = await CheckoutHandlers.billingAddressUpdateHandler(
        checkoutId,
        addressDetails,
      );
      return prepareSuccessResponse(response, '', 201);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  public async getShippingAndBillingAddress(
    checkoutId: string,
  ): Promise<object> {
    try {
      const response = await CheckoutHandlers.shippingAndBillingAddressHandler(
        checkoutId,
      );
      return prepareSuccessResponse(response, '', 201);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  public async getShippingMethods(userId: string): Promise<object> {
    try {
      const checkoutData = await CheckoutHandlers.marketplaceCheckoutHandler(
        userId,
        false,
      );

      const saleorCheckout = await CheckoutHandlers.checkoutHandler(
        checkoutData['checkoutId'],
      );
      const methodsListFromShopService = CheckoutUtils.getShippingMethods(
        checkoutData['bundles'],
      );
      const methodsListFromSaleor = CheckoutUtils.getShippingMethodsWithUUID(
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
      const checkoutData = await CheckoutHandlers.marketplaceCheckoutHandler(
        userId,
        true,
      );
      await Promise.all([
        CheckoutHandlers.addShippingMethodHandler(
          checkoutData['checkoutId'],
          shippingIds,
          true,
        ),
        CheckoutHandlers.updateDeliveryMethodHandler(
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
      const checkoutData = await CheckoutHandlers.marketplaceCheckoutHandler(
        userId,
      );

      const paymentGateways = await CheckoutHandlers.paymentGatewayHandler(
        checkoutData['checkoutId'],
      );
      const dummyGatewayId = CheckoutUtils.getDummyGateway(paymentGateways);
      const response = await CheckoutHandlers.createPaymentHandler(
        checkoutData['checkoutId'],
        dummyGatewayId,
      );
      return prepareSuccessResponse(response, '', 201);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }

  public async checkoutComplete(userId: string): Promise<object> {
    try {
      const checkoutData = await CheckoutHandlers.marketplaceCheckoutHandler(
        userId,
      );
      const selectedBundles = CheckoutUtils.getSelectedBundles(
        checkoutData['bundles'],
      );
      const checkoutBundleIds =
        CheckoutUtils.getCheckoutBundleIds(selectedBundles);
      await CheckoutHandlers.deleteBundlesHandler(
        checkoutBundleIds,
        checkoutData['checkoutId'],
        true,
      );
      const response = await CheckoutHandlers.completeCheckoutHandler(
        checkoutData['checkoutId'],
      );
      return prepareSuccessResponse(response, '', 201);
    } catch (err) {
      this.logger.error(err);
      return graphqlExceptionHandler(err);
    }
  }
}
