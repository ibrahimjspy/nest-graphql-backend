import { Injectable, Logger } from '@nestjs/common';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import {
  prepareFailedResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';
import * as CheckoutHandlers from 'src/graphql/handlers/checkout/checkout';
import { orderCreateFromCheckoutHandler } from 'src/graphql/handlers/checkout/checkout';
import { NoPaymentIntentError } from './Checkout.errors';
import { MarketplaceCartService } from './cart/services/marketplace/Cart.marketplace.service';
import { PaymentService } from './payment/Payment.service';
import { CreateCheckoutDto } from './dto/createCheckout';
import {
  B2B_CHECKOUT_APP_TOKEN,
  SHAROVE_BILLING_ADDRESS,
  SHAROVE_EMAIL,
  SHAROVE_PASSWORD,
} from 'src/constants';
import { getOrdersByShopId } from '../orders/Orders.utils';
import { OrdersService } from '../orders/Orders.service';
import { LegacyService } from 'src/external/services/osPlaceOrder/Legacy.service';
import { preparePromotionResponse } from './shipping/services/Shipping.response';
import {
  addPreAuthInCheckoutResponse,
  checkoutShippingMethodsSort,
  extractOsOrderNumber,
  getLessInventoryProducts,
  getProductIds,
  transformOsOrderPayload,
} from './Checkout.utils';
import OsOrderService from 'src/external/services/osOrder/osOrder.service';
import { ProductType } from './Checkout.utils.type';
import { getB2bProductMapping } from 'src/external/endpoints/b2cMapping';
import { getOsProductMapping } from 'src/external/endpoints/b2bMapping';
import { authenticateAuth0User } from 'src/external/endpoints/auth0';
import { getUserByToken } from '../account/user/User.utils';
import { ProductIdsMappingType } from 'src/external/endpoints/b2bMapping.types';

@Injectable()
export class CheckoutService {
  private readonly logger = new Logger(CheckoutService.name);
  constructor(
    private paymentService: PaymentService,
    private marketplaceCartService: MarketplaceCartService,
    private ordersService: OrdersService,
    private osOrderService: OsOrderService,
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
      addPreAuthInCheckoutResponse(
        CheckoutPreAuthAmount,
        SaleorCheckoutSummary,
      );
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
        orderDetails['billingAddress'],
        orderDetails['deliveryMethod'],
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
      const osOrderId = extractOsOrderNumber(
        osOrderResponse as OsOrderResponseInterface,
      );
      await this.paymentService.paymentIntentUpdate(paymentIntentId, osOrderId);
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

  /**
   * @description -- this method place order on orangeshine as sharove against B2C order
   * @step -- Authenticate Sharove user for getting access token
   * @step -- Get b2c order detail against given b2c order id
   * @step -- Get less inventory products from b2c order detail
   * @step -- Get OS product ids from elastic search mapping agianst b2c product ids
   * @step -- Create sharove shipping address on orangeshine
   * @step -- Get bundles from orangeshine against given OS product ids
   * @step -- Transform data for orangeshine order payload
   * @step -- Place order on orangeshine against sharove account with transformed payload
   * @return -- Orangeshine order response
   */
  public async osPlaceOrder(orderId: string, token: string): Promise<object> {
    try {
      const userAuthReponse = await authenticateAuth0User(
        SHAROVE_EMAIL,
        SHAROVE_PASSWORD,
      );
      const userAccessToken = userAuthReponse?.access_token;
      const userDetail = getUserByToken(userAccessToken);
      const osUserId = userDetail['os_user_id'];
      const orderDetail: any = await this.ordersService.getOrderDetailsById(
        orderId,
        token,
      );

      const orderNumber = orderDetail?.data?.number;
      const lessInventoryProducts: ProductType[] =
        getLessInventoryProducts(orderDetail);
      const b2cProductIds: string[] = getProductIds(lessInventoryProducts);
      const b2bProductMapping: ProductIdsMappingType =
        await getB2bProductMapping(b2cProductIds);
      const b2bProductIds = Array.from(b2bProductMapping.values());
      const osProductMapping: ProductIdsMappingType = await getOsProductMapping(
        b2bProductIds,
      );
      const osProductIds = Array.from(osProductMapping.values());
      const osShippingAddress: any =
        await this.osOrderService.createShippingAddress({
          ...SHAROVE_BILLING_ADDRESS,
          user_id: osUserId,
        });
      const osProductsBundles = await this.osOrderService.getBundles(
        osProductIds,
      );
      const OsShippingAddressId = osShippingAddress?.data?.user_id;
      const osOrderPayload = transformOsOrderPayload({
        orderNumber,
        b2cProducts: lessInventoryProducts,
        osProductMapping,
        b2bProductMapping,
        OsShippingAddressId,
        osProductsBundles,
      });

      const response = await this.osOrderService.placeOrder(
        osOrderPayload,
        SHAROVE_EMAIL,
        orderId,
        userAccessToken,
      );
      return prepareSuccessResponse(
        { response },
        'order created on orangeshine',
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
}
