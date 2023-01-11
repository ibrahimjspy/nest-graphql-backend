import { HttpException, Injectable, Logger } from '@nestjs/common';
import RecordNotFound from 'src/core/exceptions/recordNotFound';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import {
  prepareFailedResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';

import * as CheckoutHandlers from 'src/graphql/handlers/checkout';
import * as ProductHandlers from 'src/graphql/handlers/product';
import * as CheckoutUtils from './Checkout.utils';
import {
  AddressDetailType,
  CheckoutBundleInputType,
} from 'src/graphql/handlers/checkout.type';
import { BundleType } from 'src/graphql/types/bundle.type';
import { getHttpErrorMessage } from 'src/external/utils/httpHelper';
@Injectable()
export class CheckoutService {
  private readonly logger = new Logger(CheckoutService.name);

  public async getShoppingCartData(
    userEmail: string,
    token: string,
  ): Promise<object> {
    try {
      const checkoutData = await CheckoutHandlers.getCheckoutbundlesHandler(
        userEmail,
        true,
        token,
      );
      // const checkoutData = await CheckoutHandlers.marketplaceCheckoutHandler(
      //   id,
      //   true,
      //   token,
      // );
      // const productIds = CheckoutUtils.getProductIdsByCheckoutBundles(
      //   checkoutData['bundles'],
      // );
      // const variantIds = CheckoutUtils.getVariantsIdsByProducts(
      //   await ProductHandlers.variantsIdsByProductIdsHandler(productIds),
      // );
      // const totalVariantIds = variantIds.length;
      // const stepSize = 10;
      // let startIndex = 0;
      // let lastIndex = stepSize - 1;

      // while (startIndex <= totalVariantIds) {
      //   const slicedVariantIds = variantIds.slice(startIndex, lastIndex);

      //   const allBundles = await ProductHandlers.bundlesByVariantsIdsHandler(
      //     slicedVariantIds,
      //   );
      //   checkoutData['bundles'] = checkoutData['bundles']?.concat(
      //     CheckoutUtils.getBundlesNotInCheckout(
      //       checkoutData['bundles'],
      //       allBundles,
      //     ),
      //   );
      //   startIndex = lastIndex + 1;
      //   lastIndex = lastIndex + stepSize;
      // }

      return prepareSuccessResponse(checkoutData);
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
    token: string,
  ) {
    const { checkoutId, bundles } = checkoutData;
    const [bundlesWithUpdatedQuantity, checkoutLines] = await Promise.all([
      CheckoutUtils.updateBundlesQuantity(bundles, bundlesForCart),
      CheckoutUtils.getLineItems(bundlesList, bundlesForCart),
    ]);

    const checkoutWithLines = await CheckoutHandlers.addLinesHandler(
      checkoutId,
      checkoutLines,
      token,
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
      token,
    );
  }

  private async addToCartWhenCheckoutNotExists(
    userData,
    bundlesList: BundleType[],
    bundlesForCart: CheckoutBundleInputType[],
    token: string,
  ) {
    const checkoutLines = await CheckoutUtils.getLineItems(
      bundlesList,
      bundlesForCart,
    );

    const newCheckout: any = await CheckoutHandlers.createCheckoutHandler(
      userData?.email,
      checkoutLines,
      token,
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
      token,
    );
  }

  public async addToCart(
    userEmail: string,
    bundlesForCart: CheckoutBundleInputType[],
    token: string,
  ): Promise<object> {
    try {
      let response: object = {};
      const getBundleIdsArray = await CheckoutUtils.getBundleIds(
        bundlesForCart,
      );
      /* Mapping the bundleIds from the bundlesForCart array. */
      const validateBundleList = await CheckoutHandlers.validateBundleIsExist(
        userEmail,
        getBundleIdsArray,
        token,
      );
      /* The above code is checking if the bundleIdsExist in the cart or not. If it exists then it will
     update the bundle in the cart. If it does not exist then it will add the bundle in the cart. */
      if (validateBundleList['bundleIdsExist']['length'] > 0) {
        const updateCheckoutbundleList = await CheckoutUtils.getIsExtingBundle(
          bundlesForCart,
          validateBundleList,
        );
        const updatedBundle =
          await CheckoutHandlers.updateCheckoutBundlesHandler(
            userEmail,
            updateCheckoutbundleList,
            token,
          );

        response = {
          ...response,
          updatedBundle,
        };
      }
      if (validateBundleList['bundleIdsNotExist']['length'] > 0) {
        const addbundleList = await CheckoutUtils.getIsNotExtingBundle(
          bundlesForCart,
          validateBundleList,
        );
        const addedBundleList =
          await CheckoutHandlers.addCheckoutBundlesHandler(
            userEmail,
            addbundleList,
            token,
          );
        response = {
          ...response,
          addedBundle: addedBundleList,
        };
      }
      return prepareSuccessResponse(response, '', 201);
      // If Bundle is not exist
      // const responses = CheckoutHandlers.marketplaceCheckoutHandler(
      //   userEmail,
      //   false,
      //   token,
      // );
      // console.log(responses);

      // const [userData, bundlesList, checkoutData] = await Promise.all([
      //   AccountHandlers.userEmailByIdHandler(userId, token),
      // ProductHandlers.bundlesByBundleIdsHandler(bundlesForCart, token),
      //   CheckoutHandlers.marketplaceCheckoutHandler(userId, false, token),
      // ]);

      // let response = {};
      // if (checkoutData['checkoutId']) {
      //   response = await this.addToCartWhenCheckoutExists(
      //     userId,
      //     checkoutData,
      //     bundlesList,
      //     bundlesForCart,
      //     token,
      //   );
      // } else {
      //   response = await this.addToCartWhenCheckoutNotExists(
      //     userData,
      //     bundlesList,
      //     bundlesForCart,
      //     token,
      //   );
      // }
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
    token: string,
  ): Promise<object> {
    try {
      const checkoutData = await CheckoutHandlers.marketplaceCheckoutHandler(
        userId,
        true,
        token,
      );

      const saleorCheckout = await CheckoutHandlers.checkoutHandler(
        checkoutData['checkoutId'],
        token,
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
        token,
      );
      const response = await CheckoutHandlers.deleteBundlesHandler(
        checkoutBundleIds,
        checkoutData['checkoutId'],
        false,
        token,
      );
      return prepareSuccessResponse(response, '', 201);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async updateBundleFromCart(
    userEmail: string,
    bundlesFromCart: object,
    token: string,
  ): Promise<object> {
    try {
      const UpdateBundle = [bundlesFromCart];
      const UpdateBundleresponse =
        await CheckoutHandlers.updateCheckoutBundlesHandler(
          userEmail,
          UpdateBundle,
          token,
        );

      // const saleorCheckout = await CheckoutHandlers.checkoutHandler(
      //   checkoutData['checkoutId'],
      //   token,
      // );

      // const updatedLinesWithQuantity =
      //   CheckoutUtils.getUpdatedLinesWithQuantity(
      //     saleorCheckout['lines'],
      //     checkoutData['bundles'],
      //     bundlesFromCart,
      //   );

      // await CheckoutHandlers.updateLinesHandler(
      //   checkoutData['checkoutId'],
      //   updatedLinesWithQuantity,
      //   token,
      // );
      // const response = await CheckoutHandlers.addBundlesHandler(
      //   checkoutData['checkoutId'],
      //   userId,
      //   bundlesFromCart,
      //   token,
      // );
      return prepareSuccessResponse(UpdateBundleresponse, '', 201);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async setBundleAsSelected(
    userId: string,
    bundleIds: string[],
    token: string,
  ): Promise<object> {
    try {
      const checkoutData = await CheckoutHandlers.marketplaceCheckoutHandler(
        userId,
        false,
        token,
      );
      const saleorCheckout = await CheckoutHandlers.checkoutHandler(
        checkoutData['checkoutId'],
        token,
      );
      const checkoutLines = CheckoutUtils.getCheckoutLineItems(
        saleorCheckout['lines'],
        checkoutData['bundles'],
        bundleIds,
      );
      await CheckoutHandlers.addLinesHandler(
        checkoutData['checkoutId'],
        checkoutLines,
        token,
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
        token,
      );
      return prepareSuccessResponse(response, '', 201);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async setBundleAsUnselected({
    userId,
    bundleIds,
    checkoutBundleIds,
    token,
  }): Promise<object> {
    try {
      const checkoutData = await CheckoutHandlers.marketplaceCheckoutHandler(
        userId,
        false,
        token,
      );
      const saleorCheckout = await CheckoutHandlers.checkoutHandler(
        checkoutData['checkoutId'],
        token,
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
        token,
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
        token,
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
    token: string,
  ): Promise<object> {
    try {
      const response = await CheckoutHandlers.shippingAddressUpdateHandler(
        checkoutId,
        addressDetails,
        token,
      );
      // When address is added we also need to update on OrangeShine.
      // addShippingAddressInfo({
      //   address1: addressDetails.streetAddress1,
      //   address2: addressDetails.streetAddress2,
      //   city: addressDetails.city,
      //   state: addressDetails.countryArea,
      //   zipcode: addressDetails.postalCode,
      // });
      return prepareSuccessResponse(response, '', 201);
    } catch (error) {
      this.logger.error(error);
      if (error instanceof HttpException) {
        const parsed_error = getHttpErrorMessage(error);
        return {
          error: JSON.stringify(parsed_error.message?.data),
          status: parsed_error?.status,
        };
      } else {
        return graphqlExceptionHandler(error);
      }
    }
  }

  public async addBillingAddress(
    checkoutId: string,
    addressDetails: AddressDetailType,
    token: string,
  ): Promise<object> {
    try {
      const response = await CheckoutHandlers.billingAddressUpdateHandler(
        checkoutId,
        addressDetails,
        token,
      );
      return prepareSuccessResponse(response, '', 201);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async getShippingAndBillingAddress(
    checkoutId: string,
    token: string,
  ): Promise<object> {
    try {
      const response = await CheckoutHandlers.shippingAndBillingAddressHandler(
        checkoutId,
        token,
      );
      return prepareSuccessResponse(response, '', 201);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async getShippingMethods(
    userId: string,
    token: string,
  ): Promise<object> {
    try {
      const checkoutData = await CheckoutHandlers.marketplaceCheckoutHandler(
        userId,
        true,
        token,
      );

      const shippingZones = await CheckoutHandlers.getShippingZonesHandler(
        token,
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
    token: string,
  ): Promise<object> {
    try {
      const checkoutData = await CheckoutHandlers.marketplaceCheckoutHandler(
        userId,
        true,
        token,
      );
      await Promise.all([
        CheckoutHandlers.addShippingMethodHandler(
          checkoutData['checkoutId'],
          shippingIds,
          true,
          token,
        ),
        CheckoutHandlers.updateDeliveryMethodHandler(
          checkoutData['checkoutId'],
          checkoutData['selectedMethods'],
          token,
        ),
      ]);
      const response = await this.getShippingMethods(userId, token);
      return prepareSuccessResponse(response, '', 201);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async createPayment(userId: string, token: string): Promise<object> {
    try {
      const checkoutData = await CheckoutHandlers.marketplaceCheckoutHandler(
        userId,
        false,
        token,
      );

      const paymentGateways = await CheckoutHandlers.paymentGatewayHandler(
        checkoutData['checkoutId'],
        token,
      );

      const dummyGatewayId = CheckoutUtils.getDummyGateway(paymentGateways);
      const response = await CheckoutHandlers.createPaymentHandler(
        checkoutData['checkoutId'],
        dummyGatewayId,
        token,
      );
      return prepareSuccessResponse(response, '', 201);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async checkoutComplete(
    userId: string,
    token: string,
  ): Promise<object> {
    try {
      const checkoutData = await CheckoutHandlers.marketplaceCheckoutHandler(
        userId,
        false,
        token,
      );
      const selectedBundles = CheckoutUtils.getSelectedBundles(
        checkoutData['bundles'],
      );

      const checkoutBundleIds =
        CheckoutUtils.getCheckoutBundleIds(selectedBundles);

      const [sharoveOrderPlaceResponse] = await Promise.all([
        CheckoutHandlers.completeCheckoutHandler(
          checkoutData['checkoutId'],
          token,
        ),
      ]);

      // const instance = new LegacyService(selectedBundles, shippingAddressInfo);
      // await instance.placeExternalOrder();
      // this.logger.log('Order Placed to OrangeShine Successfully');

      await CheckoutHandlers.deleteBundlesHandler(
        checkoutBundleIds,
        checkoutData['checkoutId'],
        true,
        token,
      );

      return prepareSuccessResponse(sharoveOrderPlaceResponse, '', 201);
    } catch (error) {
      this.logger.error(error);
      if (error instanceof HttpException) {
        const parsed_error = getHttpErrorMessage(error);
        return {
          error: JSON.stringify(parsed_error.message?.data),
          status: parsed_error?.status,
        };
      } else if (error instanceof Error) {
        return {
          error: error.message,
          status: 400,
        };
      } else {
        return graphqlExceptionHandler(error);
      }
    }
  }
}
