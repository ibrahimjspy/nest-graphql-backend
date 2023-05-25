import { Injectable } from '@nestjs/common';
import { STRIPE_RETURN_URL } from 'src/constants';
import { toCents } from 'src/modules/checkout/Checkout.utils';

import Stripe from 'stripe';

@Injectable()
export default class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15',
      timeout: 5000,
    });
  }

  protected async getCustomerByEmail(Email: string) {
    const customerId = await this.stripe.customers.list({
      email: Email,
    });
    return customerId['data'].length > 0 ? customerId['data'][0]['id'] : null;
  }

  public async customer(name: string, email: string, paymentMethodId: string) {
    const customerId: any = await this.getCustomerByEmail(email);

    let response = {};
    /* This is checking if the customer exists in the stripe database. If it does, it will update the
   customer with the new payment method. If it doesn't, it will create a new customer with the new
   payment method. */
    if (customerId) {
      response = await this.updateCustomer(customerId, paymentMethodId);
    } else {
      response = await this.createCustomer(name, email, paymentMethodId);
    }
    return response;
  }

  protected async createCustomer(
    name: string,
    email: string,
    paymentMethodId: string,
  ) {
    const response = await this.stripe.customers.create({
      payment_method: paymentMethodId,
      name,
      email,
    });

    return response;
  }

  protected async updateCustomer(customerID: string, paymentMethodId: string) {
    const response = await this.stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerID,
    });

    return response;
  }

  public async paymentMethodsList(userEmail: string) {
    const customerId: any = await this.getCustomerByEmail(userEmail);

    let paymentMethods = {};
    if (customerId) {
      paymentMethods = await this.stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
      });
    } else {
      throw new Error(`Cannot Find Any Customer against ${userEmail}`);
    }

    return paymentMethods;
  }

  public async createPaymentIntent(
    userEmail: string,
    paymentMethodId: string,
    totalAmount: number,
    confirmIntent = true,
  ): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    const customerID: any = await this.getCustomerByEmail(userEmail);

    if (customerID) {
      return await this.stripe.paymentIntents.create({
        customer: customerID,
        amount: toCents(totalAmount),
        currency: process.env.STRIPE_CURRENCY,
        payment_method: paymentMethodId,
        automatic_payment_methods: {
          enabled: true,
        },
        confirm: confirmIntent,
        capture_method: 'manual',
        return_url: STRIPE_RETURN_URL,
      });
    } else {
      throw new Error(`Cannot Find Any Customer against ${userEmail}`);
    }
  }

  public async getPaymentIntentId(paymentIntent: string) {
    const paymentInfo = await this.stripe.paymentIntents.retrieve(
      paymentIntent,
    );
    return paymentInfo;
  }
  public async createPaymentMethods() {
    const createPaymentMethod = await this.stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: '2223003122003222',
        exp_month: 9,
        exp_year: 2030,
        cvc: '112',
      },
    });
    return createPaymentMethod;
  }

  public async cancelPaymentIntentById(paymentIntentId: string) {
    const cancelPaymentIntentId = await this.stripe.paymentIntents.cancel(
      paymentIntentId,
    );
    return cancelPaymentIntentId;
  }

  public async paymentIntentUpdate(paymentIntentId: string, osOrderId: string) {
    const updatePaymentIntentDescription =
      await this.stripe.paymentIntents.update(paymentIntentId, {
        description: `os order id :: ${osOrderId}`,
      });
    return updatePaymentIntentDescription;
  }
}
