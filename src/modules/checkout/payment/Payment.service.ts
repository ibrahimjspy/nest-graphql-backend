import { Injectable, Logger } from '@nestjs/common';
import {
  prepareFailedResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';
import StripeService from 'src/external/services/stripe';
import { PaymentIntentCreationError } from '../Checkout.errors';
import { SaleorCheckoutService } from '../services/Checkout.saleor';
import {
  getPaymentDataFromMetadata,
  paymentIntentAmountValidate,
} from './Payment.utils';
import {
  preAuthTransactionHandler,
  storePaymentIntentHandler,
} from 'src/graphql/handlers/checkout/payment/payment.saleor';
import { getCheckoutMetadataHandler } from 'src/graphql/handlers/checkout/checkout';
import { B2B_CHECKOUT_APP_TOKEN } from 'src/constants';
import { SaleorCheckoutInterface } from '../Checkout.utils.type';
import { MarketplaceCartService } from '../cart/services/marketplace/Cart.marketplace.service';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  constructor(
    private stripeService: StripeService,
    private saleorCheckoutService: SaleorCheckoutService,
    private marketplaceCartService: MarketplaceCartService,
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
   * @description -- this fetches saleor checkout metadata and parses payment intent id from it
   */
  public async getPaymentDataFromMetadata(
    checkoutId,
    token,
  ): Promise<{
    paymentIntentId: string;
    paymentMethodId: string;
  }> {
    try {
      const checkoutData = await getCheckoutMetadataHandler(checkoutId, token);
      return getPaymentDataFromMetadata(checkoutData['metadata']);
    } catch (error) {
      this.logger.error(error);
    }
  }

  /**
   * @description -- this method parses checkout data of saleor and returns delivery method pre auth amount stored in object metadata
   */
  public getDeliveryMethodPreAuth(
    checkoutData: SaleorCheckoutInterface,
  ): number {
    const PRE_AUTH_AMOUNT_KEY = 'pre_auth_price';
    let preAuthAmount = 0;
    checkoutData?.deliveryMethod?.metadata?.map((meta) => {
      if (meta.key == PRE_AUTH_AMOUNT_KEY) {
        preAuthAmount = Number(meta.value);
      }
    });
    return preAuthAmount;
  }

  /**
   * @description -- this returns total amount which should be pre authorized for checkout
   */
  public getCheckoutPreAuthAmount(
    checkoutData: SaleorCheckoutInterface,
  ): number {
    const checkoutTotalGrossAmount = checkoutData?.totalPrice?.gross?.amount;
    const checkoutShippingPreAuthAmount =
      this.getDeliveryMethodPreAuth(checkoutData);
    return checkoutTotalGrossAmount + checkoutShippingPreAuthAmount;
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
    const paymentIntentResponse = await this.stripeService.createPaymentIntent(
      userEmail,
      paymentMethodId,
      totalAmount,
    );
    if (!paymentIntentResponse)
      throw new PaymentIntentCreationError(userEmail, paymentMethodId);
    const paymentIntentId = paymentIntentResponse.id;
    await Promise.all([
      storePaymentIntentHandler(
        checkoutId,
        paymentIntentId,
        paymentMethodId,
        token,
      ),
      preAuthTransactionHandler(
        checkoutId,
        paymentIntentId,
        totalAmount,
        B2B_CHECKOUT_APP_TOKEN,
      ),
    ]);
    return prepareSuccessResponse(
      { paymentIntentId },
      'new payment intent Id created and added against checkout',
      201,
    );
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
    const checkoutId = checkoutData['id'];
    const checkoutAmount = this.getCheckoutPreAuthAmount(checkoutData);
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

    this.logger.log('Creating new payment intent as checkout has updated');
    await this.stripeService.cancelPaymentIntent(paymentIntentId);
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
      const checkoutData: SaleorCheckoutInterface =
        await this.saleorCheckoutService.getCheckout(checkoutId, token);
      const checkoutAmount = this.getCheckoutPreAuthAmount(checkoutData);
      const paymentData = getPaymentDataFromMetadata(checkoutData['metadata']);
      const paymentIntentId = paymentData.paymentIntentId;
      if (paymentIntentId) {
        return this.validatePaymentIntent(
          checkoutData,
          paymentData.paymentIntentId,
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

  /**
   * @description -- this updates payment intent with order id - os
   */
  public async paymentIntentUpdate(
    paymentIntentId: string,
    osOrderId: string,
  ): Promise<object> {
    try {
      const updatePaymentIntent = await this.stripeService.paymentIntentUpdate(
        paymentIntentId,
        osOrderId,
      );
      return updatePaymentIntent;
    } catch (error) {
      this.logger.error(error);
      return prepareFailedResponse(error.message);
    }
  }

  /**
   * @description -- this delete the payment method in stripe using the paymentMethodId and fetch the remaining payment methods from stripe against it's user
   */
  public async deletePaymentMethod(
    paymentMethodId: string,
    userEmail: string,
  ): Promise<object> {
    try {
      const deletePaymentMethodResponse =
        await this.stripeService.deletePaymentMethod(paymentMethodId);
      const paymentMethodsList = await this.getPaymentMethodsList(userEmail);
      return prepareSuccessResponse(
        { deletePaymentMethodResponse, paymentMethodsList },
        'Credit Card has deleted successfully',
        201,
      );
    } catch (error) {
      this.logger.error(error);
      return prepareFailedResponse(error.message);
    }
  }

  /**
   * Get pre-authorization information for the user's checkout sessions.
   * @param {string} userEmail - The email of the user to retrieve checkout information.
   * @param {string} token - The authentication token required for API calls.
   * @returns {Promise<{ checkoutAmount: number; paymentIntentId: string | null }>}
   * A promise that resolves to an object containing the total checkout amount and paymentIntentId.
   */
  public async getCheckoutPreAuthInformation(
    userEmail: string,
    token: string,
  ): Promise<{ checkoutAmount: number; paymentIntentId: string | null }> {
    // Get an array of checkout IDs with flat fulfillment from the marketplace cart service.
    const checkoutIds =
      await this.marketplaceCartService.getFlatFulfillmentCheckoutIds(
        userEmail,
        token,
      );

    // Initialize variables to hold the paymentIntentId and total checkout amount.
    let paymentIntentId = null;
    let checkoutAmount = 0;

    // Use 'Promise.all' to execute operations for all checkout IDs concurrently.
    await Promise.all(
      checkoutIds.map(async (checkoutId) => {
        // Get the checkout data for the current checkout ID.
        const checkoutData: SaleorCheckoutInterface =
          await this.saleorCheckoutService.getCheckout(checkoutId, token);

        // Get the pre-authorization amount for the current checkout session.
        const checkoutSessionAmount =
          this.getCheckoutPreAuthAmount(checkoutData);

        // Increment the total checkout amount with the amount from the current session.
        checkoutAmount = checkoutAmount + checkoutSessionAmount;

        // Get the paymentIntentId from the checkout metadata if available.
        const paymentData = getPaymentDataFromMetadata(
          checkoutData['metadata'],
        );
        paymentIntentId = paymentData.paymentIntentId;
      }),
    );

    // Return an object containing the total checkout amount and paymentIntentId.
    return { checkoutAmount, paymentIntentId };
  }

  public async preAuthV2(
    paymentMethodId: string,
    userEmail: string,
    token: string,
  ): Promise<object> {
    try {
      const checkoutPreAuthData = await this.getCheckoutPreAuthInformation(
        userEmail,
        token,
      );
      const checkoutAmount = checkoutPreAuthData.checkoutAmount;
      const paymentIntentId = checkoutPreAuthData.paymentIntentId;
      if (paymentIntentId) {
        return this.validatePaymentIntentV2(
          checkoutAmount,
          paymentIntentId,
          userEmail,
          token,
        );
      }
      return await this.createPaymentIntentV2({
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

  protected async validatePaymentIntentV2(
    checkoutAmount: number,
    paymentIntentId: string,
    userEmail: string,
    token: string,
  ): Promise<object> {
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

    this.logger.log('Creating new payment intent as checkout has updated');
    await this.stripeService.cancelPaymentIntent(paymentIntentId);
    const newPaymentIntentCreate = await this.createPaymentIntentV2({
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
  }

  protected async createPaymentIntentV2({
    userEmail,
    paymentMethodId,
    totalAmount,
    token,
  }): Promise<object> {
    const paymentIntentResponse = await this.stripeService.createPaymentIntent(
      userEmail,
      paymentMethodId,
      totalAmount,
    );
    const checkoutIds =
      await this.marketplaceCartService.getMarketplaceCheckoutIds(
        userEmail,
        token,
      );
    if (!paymentIntentResponse)
      throw new PaymentIntentCreationError(userEmail, paymentMethodId);
    const paymentIntentId = paymentIntentResponse.id;
    checkoutIds.map(async (checkoutId) => {
      await Promise.all([
        storePaymentIntentHandler(
          checkoutId,
          paymentIntentId,
          paymentMethodId,
          token,
        ),
        preAuthTransactionHandler(
          checkoutId,
          paymentIntentId,
          totalAmount,
          B2B_CHECKOUT_APP_TOKEN,
        ),
      ]);
    });

    return prepareSuccessResponse(
      { paymentIntentId },
      'new payment intent Id created and added against user',
      201,
    );
  }
}
