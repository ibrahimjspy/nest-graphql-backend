import { Injectable, Logger } from '@nestjs/common';
import RecordNotFound from 'src/core/exceptions/recordNotFound';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import {
  prepareFailedResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';

import * as CheckoutHandlers from 'src/graphql/handlers/checkout/checkout';
import {
  createCheckoutHandler,
  getCheckoutBundlesByCheckoutIdHandler,
  orderCreateFromCheckoutHandler,
} from 'src/graphql/handlers/checkout/checkout';

import { getLinesFromBundles, validateBundlesLength } from './Checkout.utils';
import SqsService from 'src/external/endpoints/sqsMessage';
import { NoPaymentIntentError } from './Checkout.errors';
import { CartService } from './cart/Cart.service';

@Injectable()
export class CheckoutService {
  private readonly logger = new Logger(CheckoutService.name);
  constructor(
    private sqsService: SqsService,
    private cartService: CartService,
  ) {
    return;
  }

  /**
   * @description -- this method is called at the end of order placement in sharove to send an event to sqs queue providing it
   * created order details and checkout id
   * @step - this method behind the scenes triggers a lambda which transforms an order from Sharove structure to OS structure
   * @step - uses transformed order to place it against OS
   */
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

  /**
   * @description -- this method is called after shipping methods and payment methods assignment with Checkout to create an order
   * at the end of process
   * @step - it validates if payment intent is created using preAuth method in payment service
   * @step - it then creates order by just giving checkout id and Auth token
   * @step - it triggers an sqs event to add that order to shop
   * @step - disables checkout session from shop service checkout
   * @step - it takes order and bundle information and then store that order to shop using addOrderToShop
   */
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

  /**
   * @description -- this method is called when create checkout is hit by admin,
   * @step - it bypasses shipping and payment apis to use all ready predefined methods to place an order directly
   */
  public async createAdminCheckout(userEmail: string, token: string) {
    return { userEmail, token };
  }

  /**
   * @description -- this method is called when create checkout is hit by end consumer
   * @step - it creates checkout session in both saleor and shop service checkout
   */
  public async createCheckout(userEmail: string, token: string) {
    try {
      const checkoutData = await CheckoutHandlers.getCheckoutBundlesHandler(
        userEmail,
        token,
      );
      if (!validateBundlesLength(checkoutData['checkoutBundles'])) {
        throw new RecordNotFound('Empty Cart');
      }
      const checkoutLines = getLinesFromBundles(
        checkoutData['checkoutBundles'],
      );
      const checkoutCreate = await createCheckoutHandler(
        userEmail,
        checkoutLines,
        token,
      );
      await this.cartService.addCheckoutIdToMarketplace(
        userEmail,
        token,
        checkoutCreate['checkout']['id'],
      );
      return checkoutCreate;
    } catch (error) {
      this.logger.error(error);
      return prepareFailedResponse(error.message);
    }
  }
}
