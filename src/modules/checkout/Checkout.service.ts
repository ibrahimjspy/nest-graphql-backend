import { Injectable, Logger } from '@nestjs/common';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import {
  prepareFailedResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';

import * as CheckoutHandlers from 'src/graphql/handlers/checkout/checkout';
import { orderCreateFromCheckoutHandler } from 'src/graphql/handlers/checkout/checkout';

import SqsService from 'src/external/endpoints/sqsMessage';
import { NoPaymentIntentError } from './Checkout.errors';
import { MarketplaceCartService } from './cart/services/marketplace/Cart.marketplace.service';
import { PaymentService } from './payment/Payment.service';
import { CreateCheckoutDto } from './dto/createCheckout';
import { B2B_CHECKOUT_APP_TOKEN } from 'src/constants';

@Injectable()
export class CheckoutService {
  private readonly logger = new Logger(CheckoutService.name);
  constructor(
    private sqsService: SqsService,
    private paymentService: PaymentService,
    private marketplaceCartService: MarketplaceCartService,
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
    checkoutBundles: string,
    orderDetails: object,
  ): Promise<object> {
    try {
      const orderObject = {
        checkoutBundles: checkoutBundles,
        shippingAddress: orderDetails['shippingAddress'],
        orderId: orderDetails['id'],
      };
      await this.sqsService.send(orderObject);
      /* Sending a message to the SQS queue. */
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
      const [checkoutBundles, paymentIntent] = await Promise.all([
        await this.marketplaceCartService.getAllCheckoutBundles({
          checkoutId,
          token,
          isSelected: true,
        }),
        await this.paymentService.getPaymentIntentFromMetadata(
          checkoutId,
          token,
        ),
      ]);
      if (!paymentIntent) throw new NoPaymentIntentError(checkoutId);
      const createOrder = await orderCreateFromCheckoutHandler(
        checkoutId,
        B2B_CHECKOUT_APP_TOKEN,
      );
      await Promise.all([
        await this.triggerWebhookForOS(
          checkoutBundles['data']['checkoutBundles'],
          createOrder['order'],
        ),
        await CheckoutHandlers.disableCheckoutSession(checkoutId, token),
      ]);
      return prepareSuccessResponse(
        { createOrder },
        'order created against checkout',
        201,
      );
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
   * @step - it validates whether checkout is valid for processing
   */
  public async createCheckout(checkoutData: CreateCheckoutDto, token: string) {
    try {
      const checkoutId = checkoutData.checkoutId;
      const validateCheckout = await CheckoutHandlers.validateCheckoutHandler(
        checkoutId,
        token,
      );
      return prepareSuccessResponse(validateCheckout);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }
}
