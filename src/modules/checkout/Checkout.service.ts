import { Injectable, Logger } from '@nestjs/common';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import {
  prepareFailedResponse,
  prepareSuccessResponse,
} from 'src/core/utils/response';
import * as CheckoutHandlers from 'src/graphql/handlers/checkout/checkout';
import { orderCreateFromCheckoutHandler } from 'src/graphql/handlers/checkout/checkout';
import {
  CheckoutIdError,
  NoPaymentIntentError,
  OrderCreationError,
  OsOrderPlaceError,
} from './Checkout.errors';
import { MarketplaceCartService } from './cart/services/marketplace/Cart.marketplace.service';
import { PaymentService } from './payment/Payment.service';
import { CreateCheckoutDto } from './dto/createCheckout';
import {
  B2B_CHECKOUT_APP_TOKEN,
  SHAROVE_BILLING_ADDRESS,
  SHAROVE_EMAIL,
  SHAROVE_PASSWORD,
} from 'src/constants';
import { OrdersService } from '../orders/Orders.service';
import { LegacyService } from 'src/external/services/osPlaceOrder/Legacy.service';
import { preparePromotionResponse } from './shipping/services/Shipping.response';
import {
  addPreAuthInCheckoutResponse,
  checkoutShippingMethodsSort,
  extractOsOrderNumber,
  getLessInventoryProducts,
  getOrdersShippingMethodMapping,
  getProductIds,
  getUserFullName,
} from './Checkout.utils';
import OsOrderService from 'src/external/services/osOrder/osOrder.service';
import {
  CheckoutSummaryInputEnum,
  OrderCreateInterface,
  OsOrderResponseInterface,
  ProductType,
} from './Checkout.utils.type';
import { getB2bProductMapping } from 'src/external/endpoints/b2cMapping';
import { getOsProductMapping } from 'src/external/endpoints/b2bMapping';
import { authenticateAuth0User } from 'src/external/endpoints/auth0';
import { ProductIdsMappingType } from 'src/external/endpoints/b2bMapping.types';
import { sendOrderConfirmationEmail } from 'src/external/endpoints/mandrillApp';
import { getTokenWithoutBearer } from '../account/user/User.utils';
import RecordNotFound from 'src/core/exceptions/recordNotFound';

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
          CheckoutHandlers.marketplaceCheckoutSummaryHandler(
            checkoutId,
            token,
            CheckoutSummaryInputEnum.id,
          ),
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
   * @description -- returns checkout summary against user email
   */
  public async getCheckoutSummaryV2(userEmail: string, token: string) {
    try {
      const [MarketplaceCheckoutSummary, preAuthData] = await Promise.all([
        CheckoutHandlers.marketplaceCheckoutSummaryHandler(
          userEmail,
          token,
          CheckoutSummaryInputEnum.email,
        ),
        this.paymentService.getCheckoutPreAuthInformation(userEmail, token),
      ]);
      const { checkoutAmount } = preAuthData;
      return prepareSuccessResponse({
        MarketplaceCheckoutSummary,
        CheckoutPreAuthAmount: checkoutAmount,
      });
    } catch (error) {
      this.logger.error(error);
      if (error instanceof RecordNotFound) {
        return prepareFailedResponse(error.message);
      }
      return graphqlExceptionHandler(error);
    }
  }

  /**
   * @description -- this method is called at the end of order placement in sharove to place order in OS
   */
  protected async placeOrderOs(
    checkoutBundles: string,
    orders: OrderCreateInterface[],
    paymentMethodId: string,
    paymentIntentId: string,
    userEmail: string,
    token: string,
  ): Promise<object> {
    const defaultOrder = orders[0].order;
    const instance = new LegacyService(
      checkoutBundles,
      defaultOrder['shippingAddress'],
      defaultOrder['number'],
      paymentMethodId,
      defaultOrder['billingAddress'],
      getOrdersShippingMethodMapping(orders),
      paymentIntentId,
      userEmail,
      token,
    );
    return await instance.placeExternalOrder();
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
      const orderDetail: any = await this.ordersService.getOrderDetailsById(
        orderId,
        token,
      );

      this.logger.log(`Creating os order against saleor order`, orderDetail);
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
        await this.osOrderService.createShippingAddress(
          {
            ...SHAROVE_BILLING_ADDRESS,
          },
          getTokenWithoutBearer(userAccessToken),
        );
      const osProductsBundles = await this.osOrderService.getBundles(
        osProductIds,
      );
      const OsShippingAddressId = osShippingAddress?.data?.user_id;
      const osOrderPayload = this.osOrderService.transformOrderPayload({
        orderNumber,
        b2cProducts: lessInventoryProducts,
        osProductMapping,
        b2bProductMapping,
        OsShippingAddressId,
        osProductsBundles,
      });

      this.logger.log(
        `Placing OS order against b2c order id ${orderId}`,
        osOrderPayload,
      );
      const response = await this.osOrderService.placeOrder(
        osOrderPayload,
        SHAROVE_EMAIL,
        orderId,
        userAccessToken,
      );
      this.logger.log(
        `Order created in os against b2c order ${orderId}`,
        response,
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

  /**
   * @description -- this method completes checkout against all checkout session of user and places an order in os against default checkout
   */
  public async checkoutCompleteV2(
    token: string,
    userEmail: string,
  ): Promise<object> {
    try {
      const checkoutBundles =
        await this.marketplaceCartService.getAllCheckoutBundles({
          userEmail,
          checkoutIds: [],
          token,
          isSelected: true,
        });

      const checkoutIds = checkoutBundles['data'].checkoutIds;
      if (!checkoutIds.length) throw new CheckoutIdError(userEmail);

      const paymentData = await this.paymentService.getPaymentDataFromMetadata(
        checkoutIds[0],
        token,
      );
      const { paymentIntentId, paymentMethodId } = paymentData || {};

      const orders = await Promise.all(
        checkoutIds.map((checkoutId) => {
          return orderCreateFromCheckoutHandler(
            checkoutId,
            B2B_CHECKOUT_APP_TOKEN,
          );
        }),
      );

      if (orders.length === 0) throw new OrderCreationError(userEmail);
      const defaultOrder = orders[0];
      const saleorOrderId = defaultOrder.order.id;
      this.logger.log(
        `Order created against checkout id ${checkoutIds}`,
        saleorOrderId,
      );

      const [osOrderResponse] = await Promise.all([
        this.placeOrderOs(
          checkoutBundles['data'].checkoutBundles,
          orders,
          paymentMethodId,
          paymentIntentId,
          userEmail,
          token,
        ),
        CheckoutHandlers.disableCheckoutSession(checkoutIds, token),
      ]);

      const osOrderId = extractOsOrderNumber(
        osOrderResponse as OsOrderResponseInterface,
      );
      this.logger.log(
        `Os order id ${osOrderId} created against checkout id ${checkoutIds}`,
      );

      if (paymentIntentId && paymentIntentId !== '' && osOrderId) {
        await this.paymentService.paymentIntentUpdate(
          paymentIntentId,
          osOrderId,
        );
      }
      sendOrderConfirmationEmail({
        id: saleorOrderId,
        email: checkoutBundles['data'].userEmail,
        name: getUserFullName(defaultOrder),
      });

      return prepareSuccessResponse(
        { createOrder: orders, osOrderResponse },
        'order created against checkout',
        201,
      );
    } catch (error) {
      this.logger.error(error);
      if (
        error instanceof NoPaymentIntentError ||
        error instanceof OsOrderPlaceError
      ) {
        return prepareFailedResponse(error.message);
      } else {
        return graphqlExceptionHandler(error);
      }
    }
  }
}
