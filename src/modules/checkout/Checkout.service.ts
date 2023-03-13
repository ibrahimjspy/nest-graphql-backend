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
  orderCreateFromCheckoutHandler,
} from 'src/graphql/handlers/checkout/checkout';

import { getLinesFromBundles, validateBundlesLength } from './Checkout.utils';
import SqsService from 'src/external/endpoints/sqsMessage';
import {
  MinimumOrderAmountError,
  NoPaymentIntentError,
} from './Checkout.errors';
import { MarketplaceCartService } from './cart/services/marketplace/Cart.marketplace.service';
import { SaleorCheckoutService } from './services/Checkout.saleor';
import { CheckoutValidationService } from './services/Checkout.validation';
import { PaymentService } from './payment/Payment.service';

@Injectable()
export class CheckoutService {
  private readonly logger = new Logger(CheckoutService.name);
  constructor(
    private sqsService: SqsService,
    private paymentService: PaymentService,
    private checkoutValidationService: CheckoutValidationService,
    private marketplaceCartService: MarketplaceCartService,
    private saleorCheckoutService: SaleorCheckoutService,
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
      const [isValid, checkoutBundles, paymentIntent] = await Promise.all([
        await this.checkoutValidationService.validateCheckout(
          checkoutId,
          token,
        ),
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

      if (!isValid) throw new MinimumOrderAmountError();
      if (!paymentIntent) throw new NoPaymentIntentError(checkoutId);

      const createOrder = await orderCreateFromCheckoutHandler(
        checkoutId,
        token,
      );
      await Promise.all([
        await this.triggerWebhookForOS(
          checkoutBundles['checkoutBundles'],
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
      if (
        error instanceof NoPaymentIntentError ||
        error instanceof MinimumOrderAmountError
      ) {
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
      const checkoutData = await CheckoutHandlers.getCheckoutBundlesHandler({
        userEmail,
        token,
      });
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
      await this.marketplaceCartService.addCheckoutIdToMarketplace(
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

  public async validateCheckout(checkoutId: string, token: string) {
    try {
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
