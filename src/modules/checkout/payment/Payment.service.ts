import { Injectable, Logger } from '@nestjs/common';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import {
  prepareFailedResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';
import StripeService from 'src/external/services/stripe';
import { PaymentIntentCreationError } from '../Checkout.errors';
import { SaleorCheckoutService } from '../services/Checkout.saleor';
import {
  getPaymentIntentFromMetadata,
  paymentIntentAmountValidate,
} from './Payment.utils';
import {
  preAuthTransactionHandler,
  storePaymentIntentHandler,
} from 'src/graphql/handlers/checkout/payment/payment.saleor';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  constructor(
    private stripeService: StripeService,
    private saleorCheckoutService: SaleorCheckoutService,
  ) {
    return;
  }
  /**
   * @description -- returns payment methods list from stripe against a customer
   */
  public async getPaymentMethodsList(userEmail: string): Promise<object> {
    try {
      const cardList = await this.stripeService.paymentMethodsList(userEmail);

      return cardList;
    } catch (error) {
      this.logger.error(error);
      return prepareFailedResponse(error.message);
    }
  }

  /**
   * @description -- this creates a payment session against user
   */
  public async createPayment(
    name: string,
    email: string,
    paymentMethodId: string,
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

  /**
   * @description -- this returns total amount against a checkout id from saleor
   */
  protected async createPaymentIntent({
    checkoutId,
    userEmail,
    paymentMethodId,
    totalAmount,
    token,
  }): Promise<object> {
    try {
      const paymentIntentResponse =
        await this.stripeService.createPaymentIntent(
          userEmail,
          paymentMethodId,
          totalAmount,
        );
      if (!paymentIntentResponse)
        throw new PaymentIntentCreationError(userEmail, paymentMethodId);
      const paymentIntentId = paymentIntentResponse.id;
      await Promise.all([
        storePaymentIntentHandler(checkoutId, paymentIntentId, token),
        preAuthTransactionHandler(
          checkoutId,
          paymentIntentId,
          totalAmount,
          token,
        ),
      ]);
      return prepareSuccessResponse(
        { paymentIntentId },
        'new payment intent Id created and added against checkout',
        201,
      );
    } catch (error) {
      this.logger.error(error.message);
      return prepareFailedResponse(error.message);
    }
  }
  /**
   * @description -- this returns total amount against a checkout id from saleor
   */
  protected async validatePaymentIntent(
    checkoutData,
    paymentIntentId: string,
    userEmail: string,
    token: string,
  ): Promise<object> {
    try {
      const checkoutId = checkoutData['id'];
      const checkoutAmount = checkoutData.totalPrice.gross.amount;
      const paymentIntentData = await this.stripeService.getPaymentIntentId(
        paymentIntentId,
      );
      const paymentMethodId = paymentIntentData.payment_method;
      const paymentIntentAmount = paymentIntentData.amount;

      if (paymentIntentAmountValidate(checkoutAmount, paymentIntentAmount)) {
        return prepareSuccessResponse(
          { paymentIntentId },
          'existing payment intent id is valid',
          201,
        );
      }

      await this.stripeService.cancelPaymentIntentById(paymentIntentId);
      const newPaymentIntentCreate = await this.createPaymentIntent({
        checkoutId,
        userEmail,
        paymentMethodId,
        totalAmount: checkoutAmount,
        token,
      });

      return prepareSuccessResponse(
        {
          paymentIntentId: newPaymentIntentCreate['data']['paymentIntentId'],
        },
        'new payment intent created as checkout and intent amount are different',
        201,
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }
  /**
   * @description -- this creates a payment intent in stripe against user by first fetching its total amount from salor
   * cart and then adding this amount to stripe and lastly saving this information back in saleor
   */
  public async paymentPreAuth(
    userEmail: string,
    paymentMethodId: string,
    checkoutId: string,
    token: string,
  ): Promise<object> {
    try {
      const checkoutData = await this.saleorCheckoutService.getCheckout(
        checkoutId,
        token,
      );
      const checkoutAmount = checkoutData['totalPrice'].gross.amount;

      const paymentIntentId = getPaymentIntentFromMetadata(
        checkoutData['metadata'],
      );
      if (paymentIntentId) {
        return this.validatePaymentIntent(
          checkoutData,
          paymentIntentId,
          userEmail,
          token,
        );
      }
      return await this.createPaymentIntent({
        checkoutId,
        userEmail,
        token,
        totalAmount: checkoutAmount,
        paymentMethodId,
      });
    } catch (error) {
      this.logger.error(error);
      return prepareFailedResponse(error.message);
    }
  }
}
