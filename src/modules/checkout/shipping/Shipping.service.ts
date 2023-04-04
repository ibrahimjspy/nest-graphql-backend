import { Injectable, Logger } from '@nestjs/common';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import { prepareSuccessResponse } from 'src/core/utils/response';
import {
  billingAddressUpdateHandler,
  shippingAddressUpdateHandler,
  updateDeliveryMethodHandler,
} from 'src/graphql/handlers/checkout/checkout';
import {
  getCheckoutShippingAddressHandler,
  getCheckoutShippingMethodsHandler,
} from 'src/graphql/handlers/checkout/shipping';
import { GetShippingMethodsDto } from './dto/shippingMethods';
import { AddressDto } from './dto/shippingAddress';
import { ShippingPromotionService } from './services/Shipping.promotion';
import { SaleorCheckoutInterface } from '../Checkout.utils.type';

@Injectable()
export class ShippingService {
  private readonly logger = new Logger(ShippingService.name);
  constructor(
    private readonly shippingPromotionService: ShippingPromotionService,
  ) {
    return;
  }
  /**
   * @description -- this method adds a billing address against checkout id , it is currently storing this in saleor
   */
  public async addBillingAddress(
    checkoutId: string,
    addressDetails: AddressDto,
    token: string,
  ): Promise<object> {
    try {
      const response = await billingAddressUpdateHandler(
        checkoutId,
        addressDetails,
        token,
      );
      return prepareSuccessResponse(response, '', 201);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  /**
   * @description -- returns shipping and billing address against a checkout session
   */
  public async getCheckoutShippingAddress(
    checkoutId: string,
    token: string,
  ): Promise<object> {
    try {
      const response = await getCheckoutShippingAddressHandler(
        checkoutId,
        token,
      );
      return prepareSuccessResponse(response);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  /**
   * @description -- returns shipping methods from shop service
   * @warn - we are only allowing one shipping method per checkout so we do not need to map shipping methods against bundles
   */
  public async getShippingMethods(
    filter: GetShippingMethodsDto,
    token: string,
  ): Promise<object> {
    try {
      const isB2c = filter.isB2c;
      return prepareSuccessResponse(
        await getCheckoutShippingMethodsHandler(
          filter.checkoutId,
          token,
          isB2c,
        ),
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  /**
   * @description --this method is called to select shipping methods against a user id
   */
  public async selectShippingMethods(
    checkoutId: string,
    shippingMethodId: string,
    token: string,
  ): Promise<object> {
    try {
      const updateDeliveryMethod = await updateDeliveryMethodHandler(
        checkoutId,
        shippingMethodId,
        token,
      );
      return await this.shippingPromotionService.applyPromoCodeToCheckout(
        updateDeliveryMethod['checkout'],
        token,
      );
    } catch (error) {
      console.log(error);
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  /**
   * @description -- this adds shipping address against a checkout session
   *  --!-- it also adds shipping method to checkout if provided as well
   */
  public async addShippingAddress(
    checkoutId: string,
    addressDetails: AddressDto,
    shippingMethodId: string,
    token: string,
  ): Promise<object> {
    try {
      const response = await shippingAddressUpdateHandler(
        checkoutId,
        addressDetails,
        token,
      );
      if (shippingMethodId) {
        await updateDeliveryMethodHandler(checkoutId, shippingMethodId, token);
      }
      return prepareSuccessResponse(
        response,
        'shipping address added against checkout',
        201,
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
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
}
