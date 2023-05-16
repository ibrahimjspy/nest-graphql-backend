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
  PAYMENT_TYPE,
  SIGNATURE_REQUESTED,
  SMS_NUMBER,
  STORE_CREDIT,
} from 'src/constants';
import { getOrdersByShopId } from '../orders/Orders.utils';
import { OrdersService } from '../orders/Orders.service';
import { LegacyService } from 'src/external/services/osPlaceOrder/Legacy.service';
import { preparePromotionResponse } from './shipping/services/Shipping.response';
import {
  addPreAuthInCheckoutResponse,
  checkoutShippingMethodsSort,
  getLessInventoryProducts,
} from './Checkout.utils';
import OsOrderService from 'src/external/services/osOrder/osOrder.service';
import { LessInventoryProductType } from './Checkout.utils.type';
import { getB2bProductMapping } from 'src/external/endpoints/b2cMapping';
import {
  getOsProductMapping,
  getOsShopMapping,
} from 'src/external/endpoints/b2bMapping';
import {
  OsOrderItem,
  OsOrderPayloadType,
} from 'src/external/services/osOrder/osOrder.types';

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

  /**
   * @description -- this method place order on orangeshine as sharove against B2C order
   */
  public async osPlaceOrder(orderId: string, token: string): Promise<object> {
    try {
      const orderDetail = await this.ordersService.getOrderDetailsById(
        orderId,
        token,
      );
      // const b2bProductsMapping:string
      const b2cProducts: LessInventoryProductType[] =
        getLessInventoryProducts(orderDetail);
      console.log('b2cProducts', b2cProducts);
      const b2cProductIds: string[] = b2cProducts.map(
        (product) => product.productId,
      );
      console.log('b2cProductIds', b2cProductIds);
      const b2bIdsMapping: object = await getB2bProductMapping(b2cProductIds);
      const b2bProductIds = Object.values(b2bIdsMapping);
      console.log('b2bIdsMapping', b2bIdsMapping);
      const osProductIdsMapping: object = await getOsProductMapping(
        b2bProductIds,
      );
      console.log('osProductIdsMapping', osProductIdsMapping);
      const b2bShopIds = b2cProducts.map((product) => product.productVendorId);
      const osVendorMapping: object = await getOsShopMapping(b2bShopIds);
      console.log('osVendorMapping', osVendorMapping);
      const vendorColorsObj = {};
      b2cProducts.forEach(({ productVendorId, variantColor }) => {
        if (
          osVendorMapping[productVendorId] &&
          vendorColorsObj[osVendorMapping[productVendorId]]
        ) {
          vendorColorsObj[osVendorMapping[productVendorId]] = [
            ...vendorColorsObj[osVendorMapping[productVendorId]],
            variantColor,
          ];
        } else {
          vendorColorsObj[osVendorMapping[productVendorId]] = [variantColor];
        }
      });
      console.log('vendorColorsObj', vendorColorsObj);
      const osColorIds = await this.osOrderService.getOsColorMappingIDs(
        vendorColorsObj,
      );
      console.log('osColorIds', osColorIds);

      const ordersPayload: OsOrderItem[] = [];
      b2cProducts.forEach(({ productId, productVendorId, variantColor }) => {
        const osProductId = osProductIdsMapping[b2bIdsMapping[productId]];
        const osVendorId = osVendorMapping[productVendorId];
        const osColorId = osColorIds.find(
          (colorItem) =>
            colorItem.brand === osVendorId && colorItem.name === variantColor,
        ).id;
        ordersPayload.push({
          item_id: osProductId,
          color_id: osColorId,
          pack_qty: 1,
          stock_type: 'in_stock',
          memo: '',
          sms_number: SMS_NUMBER,
          spa_id: 162187,
          spm_name: 'UPS',
          store_credit: STORE_CREDIT,
          signature_requested: SIGNATURE_REQUESTED,
        });
      });

      console.log('ordersPayload', ordersPayload);

      const osOrderPayload: OsOrderPayloadType = {
        orders: ordersPayload,
        sharove_order_id: '000',
        stripe_payment_method_id: 'pm_1N8M28Gr7zGKk44AORqD8OHh',
        spa_id: 162187,
        payment_type: PAYMENT_TYPE,
        billing: {
          first_name: 'Touqeer',
          last_name: 'Ahmad',
          address1: 'Street Address 1',
          city: 'New York',
          state: 'AL',
          zipcode: '35013',
          country: 'US',
        },
      };

      const response = await this.osOrderService.placeOrder(
        osOrderPayload,
        token,
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
