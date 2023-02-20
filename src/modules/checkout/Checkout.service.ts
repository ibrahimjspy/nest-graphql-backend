import { Injectable, Logger } from '@nestjs/common';
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
  getCheckoutBundlesByCheckoutIdHandler,
  getCheckoutbundlesHandler,
  getIntentIdByCheckoutId,
  orderCreateFromCheckoutHandler,
} from 'src/graphql/handlers/checkout';

import { CreateLineItemsForSaleor } from './Checkout.utils';
import StripeService from 'src/external/services/stripe';
import SqsService from 'src/external/endpoints/sqsMessage';

@Injectable()
export class CheckoutService {
  private readonly logger = new Logger(CheckoutService.name);
  constructor(
    private stripeService: StripeService,
    private sqsService: SqsService,
  ) {
    return;
  }

  protected async triggerWebhookForOS(
    checkoutID: string,
    orderDetails: object,
    token: string,
    isSelectedBundle = true,
  ): Promise<object> {
    try {
      const getBundlesbyCheckoutId =
        await getCheckoutBundlesByCheckoutIdHandler(
          checkoutID,
          token,
          isSelectedBundle,
        );
      const osObject = {
        checkoutBundles: getBundlesbyCheckoutId['checkoutBundles'],
        shippingAddress: orderDetails['shippingAddress'],
        orderId: orderDetails['id'],
      };
      /* Sending a message to the SQS queue. */
      this.sqsService.send(osObject);

      return osObject;
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async checkoutComplete(
    token: string,
    checkoutID: string,
  ): Promise<object> {
    try {
      /* The below code is used to complete the checkout process. */
      let response = {};
      const getintentInfo = await getIntentIdByCheckoutId(checkoutID, token);

      /* Checking if the getintentInfo['intentId'] is not null. If it is null, it will throw an error. */
      if (!getintentInfo['intentId'])
        throw new GeneralError('Cannot get Payment intent Id');
      /* The below code is checking the status of the payment intent. If the status is requires_capture, then
it will call the completeCheckoutHandler function. */

      const paymentInfo = await this.stripeService.verifyPaymentByIntentId(
        getintentInfo['intentId'],
      );

      //shift this validation into /preauth API CALL
      if (paymentInfo['status'] == 'requires_capture') {
        response = await orderCreateFromCheckoutHandler(checkoutID, token);
      } else throw new GeneralError(paymentInfo['status']);

      await this.triggerWebhookForOS(checkoutID, response['order'], token);

      /* Deleting the bundles from the checkout. */
      await CheckoutHandlers.disableCheckoutSession(checkoutID, token);

      return prepareSuccessResponse(response, '', 201);
    } catch (error) {
      this.logger.error(error);
      if (error instanceof GeneralError) {
        return prepareFailedResponse(error.message);
      } else {
        return graphqlExceptionHandler(error);
      }
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
  ) {
    /* The below code is creating a checkout in saleor and updating the checkout id in the cart. */
    try {
      const getCheckoutBundles = await getCheckoutbundlesHandler(
        userEmail,
        token,
      );

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

        // const updatedCheckoutResponse =
        // await this.updateCartBundlesCheckoutIdService(
        //   userEmail,
        //   token,
        //   saleorCheckoutResponse['checkout']['id'],
        // );

        // return updatedCheckoutResponse;
      } else {
        throw new RecordNotFound('Empty cart');
      }
    } catch (error) {
      this.logger.error(error);

      return prepareFailedResponse(error.message);
    }
  }
}
