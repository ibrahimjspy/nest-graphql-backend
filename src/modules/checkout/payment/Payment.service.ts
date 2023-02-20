import { Injectable, Logger } from '@nestjs/common';
import GeneralError from 'src/core/exceptions/generalError';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import { prepareFailedResponse } from 'src/core/utils/response';
import StripeService from 'src/external/services/stripe';
import {
  getTotalAmountByCheckoutIdHandler,
  savePaymentInfoHandler,
} from 'src/graphql/handlers/checkout';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  constructor(private stripeService: StripeService) {
    return;
  }
  public async getStripePayments(userEmail: string): Promise<object> {
    try {
      const cardList = await this.stripeService.paymentMethodsList(userEmail);

      return cardList;
    } catch (error) {
      this.logger.error(error);
      return prepareFailedResponse(error.message);
    }
  }

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
}
