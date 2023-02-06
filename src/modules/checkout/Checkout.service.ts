import { HttpException, Injectable, Logger } from '@nestjs/common';
import RecordNotFound from 'src/core/exceptions/recordNotFound';
import GeneralError from 'src/core/exceptions/generalError';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import {
  prepareFailedResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';

import * as CheckoutHandlers from 'src/graphql/handlers/checkout';
import {
  createCheckoutHandler,
  getCheckoutbundlesHandler,
  getTotalAmountByCheckoutIdHandler,
  savePaymentInfoHandler,
} from 'src/graphql/handlers/checkout';
import * as CheckoutUtils from './Checkout.utils';
import { CreateLineItemsForSaleor } from './Checkout.utils';
import {
  AddressDetailType,
  CheckoutBundleInputType,
} from 'src/graphql/handlers/checkout.type';
import { BundleType } from 'src/graphql/types/bundle.type';
import { getHttpErrorMessage } from 'src/external/utils/httpHelper';
import { UpdateBundleStateDto } from 'src/modules/checkout/dto/add-bundle.dto';
import StripeService from 'src/external/services/stripe';

@Injectable()
export class CheckoutService {
  private readonly logger = new Logger(CheckoutService.name);
  constructor(private stripeService: StripeService) {
    return;
  }
  public async getShoppingCartData(
    userEmail: string,
    token: string,
  ): Promise<object> {
    try {
      const checkoutData = await getCheckoutbundlesHandler(
        userEmail,
        true,
        token,
        null,
      );

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

    const newCheckout: any = await createCheckoutHandler(
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
      /* The below code is checking if the bundleIdsExist in the cart or not. If it exists then it will
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
    } catch (error) {
      this.logger.error(error);
      if (error instanceof RecordNotFound) {
        return prepareFailedResponse(error.message);
      }
      return graphqlExceptionHandler(error);
    }
  }

  public async deleteBundleFromCart(
    userEmail: string,
    checkoutBundleIds: string[],
    token: string,
  ): Promise<object> {
    try {
      const response = await CheckoutHandlers.deleteBundlesHandler(
        checkoutBundleIds,
        userEmail,
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

  public async createPayment(
    name: string,
    email: string,
    paymentMethodId: string,
    token: string,
  ): Promise<object> {
    try {
      const customerResponse = await this.stripeService.customer(
        name,
        email,
        paymentMethodId,
      );
      return customerResponse;
    } catch (error) {
      this.logger.error(error);
      return prepareFailedResponse(error.message);
    }
  }

  protected async getTotalAmountByCheckoutID(
    token: string,
    checkoutID: string,
  ): Promise<object> {
    try {
      const totalAmountResponse = await getTotalAmountByCheckoutIdHandler(
        checkoutID,
        token,
      );

      return totalAmountResponse;
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  protected async savePaymentInfo(
    token: string,
    checkoutId: string,
    userEmail: string,
    amount: number,
    paymentStatus: number,
    intentId: string,
  ): Promise<object> {
    try {
      const paymentInfoResponse = await savePaymentInfoHandler(
        token,
        checkoutId,
        userEmail,
        amount,
        paymentStatus,
        intentId,
      );

      return paymentInfoResponse;
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async paymentPreAuth(
    userEmail: string,
    paymentMethodId: string,
    checkoutID: string,
    token: string,
    paymentStatus = 1,
  ): Promise<object> {
    try {
      /* 1. It is creating a payment intent with stripe.
       2. It is saving the payment info in the database. */
      const totalAmountResponse = await this.getTotalAmountByCheckoutID(
        checkoutID,
        token,
      );

      if (!totalAmountResponse['totalAmount'])
        throw new GeneralError('Empty cart');
      const paymentIntentResponse =
        await this.stripeService.createPaymentintent(
          userEmail,
          paymentMethodId,
          totalAmountResponse['totalAmount'],
        );
      if (!paymentIntentResponse)
        throw new GeneralError('Paymnet Intent Creation Error');

      const savePaymentInfoResponse = await this.savePaymentInfo(
        token,
        checkoutID,
        userEmail,
        paymentIntentResponse['amount'],
        paymentStatus,
        paymentIntentResponse['id'],
      );

      return savePaymentInfoResponse;
    } catch (error) {
      this.logger.error(error);
      return prepareFailedResponse(error.message);
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

  public async updateCheckoutBundleState(
    updateBundleState: UpdateBundleStateDto,
    token: string,
  ) {
    try {
      const response = await CheckoutHandlers.updateCheckoutBundleState(
        updateBundleState,
        token,
      );
      return prepareSuccessResponse(response, '', 200);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  protected async updateCartBundlesCheckoutIdService(
    userEmail: string,
    token: string,
    checkoutID: string,
  ) {
    try {
      /* The below code is updating the cart bundles for a checkout ID. */
      const response =
        await CheckoutHandlers.updateCartBundlesCheckoutIdHandler(
          userEmail,
          token,
          checkoutID,
        );

      return response;
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }
  public async createCheckoutSharovePlatformService(
    userEmail: string,
    token: string,
  ) {
    return 'SharovePlatform';
  }
  public async createCheckoutendConsumerService(
    userEmail: string,
    token: string,
    isSelectedBundle = true,
    throwException = true,
  ) {
    /* The below code is creating a checkout in saleor and updating the checkout id in the cart. */
    try {
      const getCheckoutBundles = await getCheckoutbundlesHandler(
        userEmail,
        throwException,
        token,
        isSelectedBundle,
      );
      console.log('__getCheckoutBundles', getCheckoutBundles);
      if (getCheckoutBundles['checkoutBundles'].length > 0) {
        const getCheckoutLines = await CreateLineItemsForSaleor(
          getCheckoutBundles['checkoutBundles'],
        );
        const saleorCheckoutResponse: any = await createCheckoutHandler(
          userEmail,
          getCheckoutLines,
          token,
        );

        /* if the checkout id is null. */
        if (
          !saleorCheckoutResponse['checkout'] &&
          saleorCheckoutResponse['checkout']['id']
        )
          throw new GeneralError('Saleor Checkout creation error');

        const updatedCheckoutResponse =
          await this.updateCartBundlesCheckoutIdService(
            userEmail,
            token,
            saleorCheckoutResponse['checkout']['id'],
          );

        return updatedCheckoutResponse;
      } else {
        throw new RecordNotFound('Empty cart');
      }
    } catch (error) {
      this.logger.error(error);

      return prepareFailedResponse(error.message);
    }
  }
  public async getCards(userEmail: string): Promise<object> {
    try {
      const cardList = await this.stripeService.paymentMethodsList(userEmail);

      return cardList;
    } catch (error) {
      this.logger.error(error);
      return prepareFailedResponse(error.message);
    }
  }
}
