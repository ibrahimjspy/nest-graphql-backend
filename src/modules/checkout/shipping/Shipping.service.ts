import { Injectable, Logger } from '@nestjs/common';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import { prepareSuccessResponse } from 'src/core/utils/response';
import {
  billingAddressUpdateHandler,
  shippingAddressUpdateHandler,
  shippingAndBillingAddressHandler,
  updateDeliveryMethodHandler,
} from 'src/graphql/handlers/checkout/checkout';
import { getCheckoutShippingMethodsHandler } from 'src/graphql/handlers/checkout/shipping';
import { GetShippingMethodsDto } from './dto/shippingMethods';
import { AddressDto } from './dto/shippingAddress';

@Injectable()
export class ShippingService {
  private readonly logger = new Logger(ShippingService.name);
  constructor() {
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
  public async getShippingAndBillingAddress(
    checkoutId: string,
  ): Promise<object> {
    try {
      const response = await shippingAndBillingAddressHandler(checkoutId);
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
  ): Promise<object> {
    try {
      const isB2c = filter.isB2c;
      return prepareSuccessResponse(
        await getCheckoutShippingMethodsHandler(filter.checkoutId, isB2c),
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
      return prepareSuccessResponse(
        updateDeliveryMethod,
        'shipping methods added against checkout',
        201,
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
}
