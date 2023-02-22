import { Injectable, Logger } from '@nestjs/common';
import RecordNotFound from 'src/core/exceptions/recordNotFound';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import {
  prepareFailedResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';

import * as CheckoutHandlers from 'src/graphql/handlers/checkout';
import {
  createCheckoutHandler,
  getCheckoutBundlesByCheckoutIdHandler,
  orderCreateFromCheckoutHandler,
} from 'src/graphql/handlers/checkout';

import { getLinesFromBundles, validateBundlesLength } from './Checkout.utils';
import StripeService from 'src/external/services/stripe';
import SqsService from 'src/external/endpoints/sqsMessage';
import { NoPaymentIntentError } from './Checkout.errors';

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
    checkoutId: string,
    orderDetails: object,
    token: string,
    isSelectedBundle = true,
  ): Promise<object> {
    try {
      const checkoutData = await getCheckoutBundlesByCheckoutIdHandler(
        checkoutId,
        token,
        isSelectedBundle,
      );
      const orderObject = {
        checkoutBundles: checkoutData['checkoutBundles'],
        shippingAddress: orderDetails['shippingAddress'],
        orderId: orderDetails['id'],
      };
      /* Sending a message to the SQS queue. */
      this.sqsService.send(orderObject);

      return orderObject;
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async checkoutComplete(
    token: string,
    checkoutId: string,
  ): Promise<object> {
    try {
      const paymentIntent = await CheckoutHandlers.getPaymentIntentHandler(
        checkoutId,
        token,
      );
      if (!paymentIntent['intentId'])
        throw new NoPaymentIntentError(checkoutId);
      const createOrder = await orderCreateFromCheckoutHandler(
        checkoutId,
        token,
      );
      await this.triggerWebhookForOS(checkoutId, createOrder['order'], token);
      const disableCheckout = await CheckoutHandlers.disableCheckoutSession(
        checkoutId,
        token,
      );

      return prepareSuccessResponse({ createOrder, disableCheckout }, '', 201);
    } catch (error) {
      this.logger.error(error);
      if (error instanceof NoPaymentIntentError) {
        return prepareFailedResponse(error.message);
      } else {
        return graphqlExceptionHandler(error);
      }
    }
  }

  public async createAdminCheckout(userEmail: string, token: string) {
    return { userEmail, token };
  }

  public async createCheckout(userEmail: string, token: string) {
    try {
      const checkoutData = await CheckoutHandlers.getCheckoutBundlesHandler(
        userEmail,
        token,
      );
      if (validateBundlesLength(checkoutData['checkoutBundles'])) {
        throw new RecordNotFound('Empty Cart');
      }
      const checkoutLines = await getLinesFromBundles(
        checkoutData['checkoutBundles'],
      );
      const checkoutCreate = await createCheckoutHandler(
        userEmail,
        checkoutLines,
        token,
      );
      return checkoutCreate;
    } catch (error) {
      this.logger.error(error);
      return prepareFailedResponse(error.message);
    }
  }
}
