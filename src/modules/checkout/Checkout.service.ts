import { Injectable, Logger, Inject } from '@nestjs/common';
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
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import {
  AddressDetailType,
  CheckoutBundleInputType,
} from 'src/graphql/handlers/checkout.type';
import { BundleType } from 'src/graphql/types/bundle.type';

@Injectable()
export class CheckoutService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}
  private readonly logger = new Logger(CheckoutService.name);
  private readonly authorizationToken = this.request.headers.authorization;

  public async getShoppingCartData(id: string): Promise<object> {
    try {
      const checkoutBundles = await CheckoutHandlers.marketplaceCheckoutHandler(
        id,
        true,
        this.authorizationToken,
      );
      const productIds = CheckoutUtils.getProductIdsByCheckoutBundles(
        checkoutBundles['bundles'],
      );
      const variantIds = CheckoutUtils.getVariantsIdsByProducts(
        await ProductHandlers.variantsIdsByProductIdsHandler(
          productIds,
          this.authorizationToken,
        ),
      );
      const allBundles = await ProductHandlers.bundlesByVariantsIdsHandler(
        variantIds,
        this.authorizationToken,
      );

      checkoutBundles['bundles'] = checkoutBundles['bundles']?.concat(
        CheckoutUtils.getBundlesNotInCheckout(
          checkoutBundles['bundles'],
          allBundles,
        ),
      );

      return prepareSuccessResponse(checkoutBundles);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  private async addToCartWhenCheckoutExists(
    userId,
    checkoutData,
    bundlesList: BundleType[],
    bundlesForCart: CheckoutBundleInputType[],
  ) {
    const { checkoutId, bundles } = checkoutData;
    const [bundlesWithUpdatedQuantity, checkoutLines] = await Promise.all([
      CheckoutUtils.updateBundlesQuantity(bundles, bundlesForCart),
      CheckoutUtils.getLineItems(bundlesList, bundlesForCart),
    ]);

    const checkoutWithLines = await CheckoutHandlers.addLinesHandler(
      checkoutId,
      checkoutLines,
      this.authorizationToken,
    );

    bundlesForCart = CheckoutUtils.getBundlesWithLineIds(
      bundlesList,
      bundlesWithUpdatedQuantity,
      checkoutWithLines,
    );

    return await CheckoutHandlers.addBundlesHandler(
      checkoutId,
      userId,
      bundlesForCart,
      this.authorizationToken,
    );
  }

  private async addToCartWhenCheckoutNotExists(
    userData,
    bundlesList: BundleType[],
    bundlesForCart: CheckoutBundleInputType[],
  ) {
    const checkoutLines = await CheckoutUtils.getLineItems(
      bundlesList,
      bundlesForCart,
    );

    const newCheckout: any = await CheckoutHandlers.createCheckoutHandler(
      userData?.email,
      checkoutLines,
      this.authorizationToken,
    );

    bundlesForCart = CheckoutUtils.getBundlesWithLineIds(
      bundlesList,
      bundlesForCart,
      newCheckout,
    );

    return await CheckoutHandlers.addBundlesHandler(
      newCheckout?.checkout?.id,
      userData?.id,
      bundlesForCart,
      this.authorizationToken,
    );
  }

  public async addToCart(
    userId: string,
    bundlesForCart: CheckoutBundleInputType[],
  ): Promise<object> {
    try {
      const [userData, bundlesList, checkoutData] = await Promise.all([
        AccountHandlers.userEmailByIdHandler(userId, this.authorizationToken),
        ProductHandlers.bundlesByBundleIdsHandler(
          bundlesForCart,
          this.authorizationToken,
        ),
        CheckoutHandlers.marketplaceCheckoutHandler(
          userId,
          false,
          this.authorizationToken,
        ),
      ]);

      let response = {};
      if (checkoutData['checkoutId']) {
        response = await this.addToCartWhenCheckoutExists(
          userId,
          checkoutData,
          bundlesList,
          bundlesForCart,
        );
      } else {
        response = await this.addToCartWhenCheckoutNotExists(
          userData,
          bundlesList,
          bundlesForCart,
        );
      }
      return prepareSuccessResponse(response, '', 201);
    } catch (error) {
      this.logger.error(error);
      if (error instanceof RecordNotFound) {
        return prepareFailedResponse(error.message);
      }
      return graphqlExceptionHandler(error);
    }
  }

  public async deleteBundleFromCart(
    userId: string,
    checkoutBundleIds: string[],
  ): Promise<object> {
    try {
      const checkoutData = await CheckoutHandlers.marketplaceCheckoutHandler(
        userId,
        true,
        this.authorizationToken,
      );

      const saleorCheckout = await CheckoutHandlers.checkoutHandler(
        checkoutData['checkoutId'],
        this.authorizationToken,
      );

      const checkoutLines = CheckoutUtils.getCheckoutLineItemsForDelete(
        saleorCheckout['lines'],
        checkoutData['bundles'],
        checkoutBundleIds,
      );
      const checkoutLineIds = CheckoutUtils.getCheckoutLineIds(checkoutLines);
      await CheckoutHandlers.deleteLinesHandler(
        checkoutLineIds,
        saleorCheckout['id'],
        this.authorizationToken,
      );
      const response = await CheckoutHandlers.deleteBundlesHandler(
        checkoutBundleIds,
        checkoutData['checkoutId'],
        false,
        this.authorizationToken,
      );
      return prepareSuccessResponse(response, '', 201);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async updateBundleFromCart(
    userId: string,
    bundlesFromCart: CheckoutBundleInputType[],
  ): Promise<object> {
    try {
      const checkoutData = await CheckoutHandlers.marketplaceCheckoutHandler(
        userId,
        true,
        this.authorizationToken,
      );

      const saleorCheckout = await CheckoutHandlers.checkoutHandler(
        checkoutData['checkoutId'],
        this.authorizationToken,
      );

      const updatedLinesWithQuantity =
        CheckoutUtils.getUpdatedLinesWithQuantity(
          saleorCheckout['lines'],
          checkoutData['bundles'],
          bundlesFromCart,
        );

      await CheckoutHandlers.updateLinesHandler(
        checkoutData['checkoutId'],
        updatedLinesWithQuantity,
        this.authorizationToken,
      );
      const response = await CheckoutHandlers.addBundlesHandler(
        checkoutData['checkoutId'],
        userId,
        bundlesFromCart,
        this.authorizationToken,
      );
      return prepareSuccessResponse(response, '', 201);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async setBundleAsSelected(
    userId: string,
    bundleIds: string[],
  ): Promise<object> {
    try {
      const checkoutData = await CheckoutHandlers.marketplaceCheckoutHandler(
        userId,
        false,
        this.authorizationToken,
      );
      const saleorCheckout = await CheckoutHandlers.checkoutHandler(
        checkoutData['checkoutId'],
        this.authorizationToken,
      );
      const checkoutLines = CheckoutUtils.getCheckoutLineItems(
        saleorCheckout['lines'],
        checkoutData['bundles'],
        bundleIds,
      );
      await CheckoutHandlers.addLinesHandler(
        checkoutData['checkoutId'],
        checkoutLines,
        this.authorizationToken,
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
        this.authorizationToken,
      );
      return prepareSuccessResponse(response, '', 201);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async setBundleAsUnselected(
    userId: string,
    bundleIds: string[],
    checkoutBundleIds: string[],
  ): Promise<object> {
    try {
      const checkoutData = await CheckoutHandlers.marketplaceCheckoutHandler(
        userId,
        false,
        this.authorizationToken,
      );
      const saleorCheckout = await CheckoutHandlers.checkoutHandler(
        checkoutData['checkoutId'],
        this.authorizationToken,
      );
      const checkoutLines = CheckoutUtils.getCheckoutLineItemsForDelete(
        saleorCheckout['lines'],
        checkoutData['bundles'],
        checkoutBundleIds,
      );

      const checkoutLineIds = CheckoutUtils.getCheckoutLineIds(checkoutLines);

      await CheckoutHandlers.deleteLinesHandler(
        checkoutLineIds,
        saleorCheckout['id'],
        this.authorizationToken,
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
        this.authorizationToken,
      );
      return prepareSuccessResponse(response, '', 201);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
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
        this.authorizationToken,
      );
      return prepareSuccessResponse(response, '', 201);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
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
        this.authorizationToken,
      );
      return prepareSuccessResponse(response, '', 201);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async getShippingAndBillingAddress(
    checkoutId: string,
  ): Promise<object> {
    try {
      const response = await CheckoutHandlers.shippingAndBillingAddressHandler(
        checkoutId,
        this.authorizationToken,
      );
      return prepareSuccessResponse(response, '', 201);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async getShippingMethods(userId: string): Promise<object> {
    try {
      const checkoutData = await CheckoutHandlers.marketplaceCheckoutHandler(
        userId,
        true,
        this.authorizationToken,
      );

      const shippingZones = await CheckoutHandlers.getShippingZonesHandler(
        this.authorizationToken,
      );
      const shippingMethodsFromShippingZones =
        CheckoutUtils.getShippingMethodsFromShippingZones(shippingZones);

      const methodsListFromShopService = CheckoutUtils.getShippingMethods(
        checkoutData['bundles'],
      );

      const methodsListFromSaleor = CheckoutUtils.getShippingMethodsWithUUID(
        shippingMethodsFromShippingZones,
        methodsListFromShopService,
        checkoutData['selectedMethods'],
      );

      return prepareSuccessResponse(methodsListFromSaleor, '', 201);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async selectShippingMethods(
    userId: string,
    shippingIds: string[],
  ): Promise<object> {
    try {
      const checkoutData = await CheckoutHandlers.marketplaceCheckoutHandler(
        userId,
        true,
        this.authorizationToken,
      );
      await Promise.all([
        CheckoutHandlers.addShippingMethodHandler(
          checkoutData['checkoutId'],
          shippingIds,
          true,
          this.authorizationToken,
        ),
        CheckoutHandlers.updateDeliveryMethodHandler(
          checkoutData['checkoutId'],
          checkoutData['selectedMethods'],
          this.authorizationToken,
        ),
      ]);
      const response = await this.getShippingMethods(userId);
      return prepareSuccessResponse(response, '', 201);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async createPayment(userId: string): Promise<object> {
    try {
      const checkoutData = await CheckoutHandlers.marketplaceCheckoutHandler(
        userId,
        false,
        this.authorizationToken,
      );

      const paymentGateways = await CheckoutHandlers.paymentGatewayHandler(
        checkoutData['checkoutId'],
        this.authorizationToken,
      );

      const dummyGatewayId = CheckoutUtils.getDummyGateway(paymentGateways);
      const response = await CheckoutHandlers.createPaymentHandler(
        checkoutData['checkoutId'],
        dummyGatewayId,
        this.authorizationToken,
      );
      return prepareSuccessResponse(response, '', 201);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async checkoutComplete(userId: string): Promise<object> {
    try {
      const checkoutData = await CheckoutHandlers.marketplaceCheckoutHandler(
        userId,
        false,
        this.authorizationToken,
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
        this.authorizationToken,
      );
      const response = await CheckoutHandlers.completeCheckoutHandler(
        checkoutData['checkoutId'],
        this.authorizationToken,
      );
      return prepareSuccessResponse(response, '', 201);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }
}
