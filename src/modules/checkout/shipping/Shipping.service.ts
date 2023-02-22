import { HttpException, Injectable, Logger } from '@nestjs/common';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import { prepareSuccessResponse } from 'src/core/utils/response';
import { getHttpErrorMessage } from 'src/external/utils/httpHelper';
import {
  addShippingMethodHandler,
  billingAddressUpdateHandler,
  getShippingZonesHandler,
  marketplaceCheckoutHandler,
  shippingAddressUpdateHandler,
  shippingAndBillingAddressHandler,
  updateDeliveryMethodHandler,
} from 'src/graphql/handlers/checkout';
import { AddressDetailType } from 'src/graphql/handlers/checkout.type';
import {
  getShippingMethods,
  getShippingMethodsFromShippingZones,
  getShippingMethodsWithUUID,
} from '../Checkout.utils';

@Injectable()
export class ShippingService {
  private readonly logger = new Logger(ShippingService.name);
  constructor() {
    return;
  }
  public async addBillingAddress(
    checkoutId: string,
    addressDetails: AddressDetailType,
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

  public async getShippingAndBillingAddress(
    checkoutId: string,
    token: string,
  ): Promise<object> {
    try {
      const response = await shippingAndBillingAddressHandler(
        checkoutId,
        token,
      );
      return prepareSuccessResponse(response, '', 201);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async getShippingMethods(
    userId: string,
    token: string,
  ): Promise<object> {
    try {
      const checkoutData = await marketplaceCheckoutHandler(
        userId,
        true,
        token,
      );

      const shippingZones = await getShippingZonesHandler(token);
      const shippingMethodsFromShippingZones =
        getShippingMethodsFromShippingZones(shippingZones);

      const methodsListFromShopService = getShippingMethods(
        checkoutData['bundles'],
      );

      const methodsListFromSaleor = getShippingMethodsWithUUID(
        shippingMethodsFromShippingZones,
        methodsListFromShopService,
        checkoutData['selectedMethods'],
      );

      return prepareSuccessResponse(methodsListFromSaleor, '', 201);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async selectShippingMethods(
    userId: string,
    shippingIds: string[],
    token: string,
  ): Promise<object> {
    try {
      const checkoutData = await marketplaceCheckoutHandler(
        userId,
        true,
        token,
      );
      await Promise.all([
        addShippingMethodHandler(
          checkoutData['checkoutId'],
          shippingIds,
          true,
          token,
        ),
        updateDeliveryMethodHandler(
          checkoutData['checkoutId'],
          checkoutData['selectedMethods'],
          token,
        ),
      ]);
      const response = await this.getShippingMethods(userId, token);
      return prepareSuccessResponse(response, '', 201);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async addShippingAddress(
    checkoutId: string,
    addressDetails: AddressDetailType,
    shippingMethodId: string,
    token: string,
  ): Promise<object> {
    try {
      const response = await shippingAddressUpdateHandler(
        checkoutId,
        addressDetails,
        token,
      );

      await updateDeliveryMethodHandler(checkoutId, shippingMethodId, token);

      // When address is added we also need to update on OrangeShine.
      // addShippingAddressInfo({
      //   address1: addressDetails.streetAddress1,
      //   address2: addressDetails.streetAddress2,
      //   city: addressDetails.city,
      //   state: addressDetails.countryArea,
      //   zipcode: addressDetails.postalCode,
      // });
      return prepareSuccessResponse(response, '', 201);
    } catch (error) {
      this.logger.error(error);
      if (error instanceof HttpException) {
        const parsed_error = getHttpErrorMessage(error);
        return {
          error: JSON.stringify(parsed_error.message?.data),
          status: parsed_error?.status,
        };
      } else {
        return graphqlExceptionHandler(error);
      }
    }
  }
}
