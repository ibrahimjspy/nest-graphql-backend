import { Injectable } from '@nestjs/common';
import { STRIPE_RETURN_URL } from 'src/constants';

import GeneralError from 'src/core/exceptions/generalError';

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
    const customerID = await this.stripe.customers.list({
      email: Email,
    });
    return customerID['data'].length > 0 ? customerID['data'][0]['id'] : null;
  }
  public async customer(name: string, email: string, paymentMethodId: string) {
    const customerID: any = await this.getCustomerByEmail(email);

    let response = {};
    if (customerID) {
      response = await this.updateCustomer(customerID, paymentMethodId);
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
    const customerID: any = await this.getCustomerByEmail(userEmail);

    let paymentMethods = {};
    if (customerID) {
      paymentMethods = await this.stripe.paymentMethods.list({
        customer: customerID,
        type: 'card',
      });
    } else {
      throw new GeneralError(`Cannot Find Any Customer`);
    }

    return paymentMethods;
  }

  public async createPaymentintent(
    userEmail: string,
    paymentMethodId: string,
    totalAmount: number,
    confirmIntent = true,
  ) {
    const customerID: any = await this.getCustomerByEmail(userEmail);

    let createPaymentIntent = {};
    if (customerID) {
      createPaymentIntent = await this.stripe.paymentIntents.create({
        customer: customerID,
        amount: Math.round(totalAmount * 100), // TODO :Math.round() - rounds to the nearest integer (if the fraction is 0.5 or greater - rounds up
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
      throw new GeneralError(`Cannot Find Any Customer`);
    }
    return createPaymentIntent;
  }
  public async createpaymentMethods() {
    const createpaymentMethod = await this.stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: '2223003122003222',
        exp_month: 9,
        exp_year: 2030,
        cvc: '112',
      },
    });
    return createpaymentMethod;
  }
}
