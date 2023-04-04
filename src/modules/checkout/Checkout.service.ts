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
import { getOrdersByShopId } from '../orders/Orders.utils';
import { OrdersService } from '../orders/Orders.service';
import { LegacyService } from 'src/external/services/osPlaceOrder/Legacy.service';
import { preparePromotionResponse } from './shipping/services/Shipping.response';
import { checkoutShippingMethodsSort } from './Checkout.utils';

@Injectable()
export class CheckoutService {
  private readonly logger = new Logger(CheckoutService.name);
  constructor(
    private sqsService: SqsService,
    private paymentService: PaymentService,
    private marketplaceCartService: MarketplaceCartService,
    private ordersService: OrdersService,
  ) {
    return;
  }

  public async getCheckoutSummary(checkoutId: string, token: string) {
    try {
      const [MarketplaceCheckoutSummary, SaleorCheckoutSummary] =
        await Promise.all([
          CheckoutHandlers.marketplaceCheckoutSummaryHandler(checkoutId, token),
          CheckoutHandlers.saleorCheckoutSummaryHandler(checkoutId, token),
        ]);
      preparePromotionResponse({
        checkout: SaleorCheckoutSummary,
      });
      const CheckoutPreAuthAmount =
        this.paymentService.getCheckoutPreAuthAmount(SaleorCheckoutSummary);
      checkoutShippingMethodsSort(SaleorCheckoutSummary);
      return prepareSuccessResponse({
        MarketplaceCheckoutSummary,
        SaleorCheckoutSummary,
        CheckoutPreAuthAmount,
      });
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }
  /**
   * @description -- this method is called at the end of order placement in sharove to place order in OS
   */
  protected async placeOrderOs(
    checkoutBundles: string,
    orderDetails: object,
    paymentMethodId: string,
    token: string,
  ): Promise<object> {
    try {
      const instance = new LegacyService(
        checkoutBundles,
        orderDetails['shippingAddress'],
        orderDetails['number'],
        paymentMethodId,
        token,
      );
      return await instance.placeExternalOrder();
    } catch (error) {
      this.logger.error(error);
      return prepareFailedResponse(error.me);
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
      const [checkoutBundles, paymentData] = await Promise.all([
        this.marketplaceCartService.getAllCheckoutBundles({
          checkoutId,
          token,
          isSelected: true,
        }),
        this.paymentService.getPaymentDataFromMetadata(checkoutId, token),
      ]);
      const { paymentIntentId, paymentMethodId } = paymentData;
      if (!paymentIntentId || !paymentMethodId)
        throw new NoPaymentIntentError(checkoutId);
      const createOrder = await orderCreateFromCheckoutHandler(
        checkoutId,
        B2B_CHECKOUT_APP_TOKEN,
      );
      const ordersByShop = {
        userEmail: checkoutBundles['data']['userEmail'],
        marketplaceOrders: getOrdersByShopId(
          checkoutBundles['data'],
          createOrder['order'],
        ),
      };
      const [osOrderResponse] = await Promise.all([
        this.placeOrderOs(
          checkoutBundles['data']['checkoutBundles'],
          createOrder['order'],
          paymentMethodId,
          token,
        ),
        this.ordersService.addOrderToShop(ordersByShop, token),
        CheckoutHandlers.disableCheckoutSession(checkoutId, token),
      ]);
      return prepareSuccessResponse(
        { createOrder, osOrderResponse },
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
