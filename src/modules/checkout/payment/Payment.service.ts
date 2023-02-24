import { Injectable, Logger } from '@nestjs/common';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import { prepareFailedResponse } from 'src/core/utils/response';
import StripeService from 'src/external/services/stripe';
import {
  getTotalAmountByCheckoutIdHandler,
  savePaymentInfoHandler,
} from 'src/graphql/handlers/checkout/checkout';
import { EmptyCartError, PaymentIntentCreationError } from '../Checkout.errors';
import { PaymentInfoInterface } from './Payment.types';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  constructor(private stripeService: StripeService) {
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
   * @description -- this saves payment information provided by customer in stripe
   */
  protected async savePaymentInfo({
    token,
    checkoutId,
    userEmail,
    amount,
    paymentStatus,
    intentId,
  }: PaymentInfoInterface): Promise<object> {
    try {
      const paymentInfoResponse = await savePaymentInfoHandler({
        token,
        checkoutId,
        userEmail,
        amount,
        paymentStatus,
        intentId,
      });

      return paymentInfoResponse;
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  /**
   * @description -- this returns total amount against a checkout id from saleor
   */
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

  /**
   * @description -- this creates a payment intent in stripe against user by first fetching its total amount from salor
   * cart and then adding this amount to stripe and lastly saving this information back in saleor
   */
  public async paymentPreAuth(
    userEmail: string,
    paymentMethodId: string,
    checkoutId: string,
    token: string,
    paymentStatus = 1,
  ): Promise<object> {
    try {
      /* 1. It is creating a payment intent with stripe.
       2. It is saving the payment info in the database. */
      const totalAmountResponse = await this.getTotalAmountByCheckoutID(
        checkoutId,
        token,
      );

      if (!totalAmountResponse['totalAmount'])
        throw new EmptyCartError(userEmail);

      const paymentIntentResponse =
        await this.stripeService.createPaymentIntent(
          userEmail,
          paymentMethodId,
          totalAmountResponse['totalAmount'],
        );
      if (!paymentIntentResponse)
        throw new PaymentIntentCreationError(userEmail, paymentMethodId);

      const savePaymentInfoResponse = await this.savePaymentInfo({
        token,
        checkoutId,
        userEmail,
        amount: paymentIntentResponse['amount'],
        paymentStatus,
        intentId: paymentIntentResponse['id'],
      });

      return savePaymentInfoResponse;
    } catch (error) {
      this.logger.error(error);
      return prepareFailedResponse(error.message);
    }
  }
}
