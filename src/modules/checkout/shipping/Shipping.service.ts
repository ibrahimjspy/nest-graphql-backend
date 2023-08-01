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
  getMarketplaceShippingMethods,
  getShippingZonesHandler,
  updateShippingMethodPriceHandler,
} from 'src/graphql/handlers/checkout/shipping';
import {
  GetShippingMethodsDto,
  GetShippingMethodsV2Dto,
  UpdateShippingMethodPriceDto,
} from './dto/shippingMethods';
import { AddUserShippingAddressDto, AddressDto } from './dto/shippingAddress';
import { ShippingPromotionService } from './services/Shipping.promotion';
import {
  addPreAuthInCheckoutResponse,
  checkoutShippingMethodsSort,
  filterFlatShippingMethods,
} from '../Checkout.utils';
import { PaymentService } from '../payment/Payment.service';
import { PaginationDto } from 'src/graphql/dto/pagination.dto';
import { SuccessResponseType } from 'src/core/utils/response.type';
import { marketplaceShippingMethodsMap } from './Shipping.utils';

@Injectable()
export class ShippingService {
  private readonly logger = new Logger(ShippingService.name);
  constructor(
    private readonly shippingPromotionService: ShippingPromotionService,
    private readonly paymentService: PaymentService,
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
      const shippingMethods = await getCheckoutShippingMethodsHandler(
        filter.checkoutId,
        token,
        isB2c,
      );
      checkoutShippingMethodsSort(shippingMethods);
      filterFlatShippingMethods(shippingMethods);
      return prepareSuccessResponse(shippingMethods);
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
      const applyPromotions =
        await this.shippingPromotionService.applyPromoCodeToCheckout(
          updateDeliveryMethod['checkout'],
          token,
        );
      const preAuthAmount = this.paymentService.getCheckoutPreAuthAmount(
        applyPromotions['data']['checkout'],
      );
      addPreAuthInCheckoutResponse(
        preAuthAmount,
        applyPromotions['data']['checkout'],
      );
      return applyPromotions;
    } catch (error) {
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
   * @description --this method returns shipping zones that are stored in saleor
   * @precondition -- you need to provide a token that has MANAGE_SHIPPING permission || it assumes we are using default channel for shipping zones
   * @post_condition -- this returns shipping zones and their shipping methods
   */
  public async getShippingZones(
    pagination: PaginationDto,
    token: string,
  ): Promise<SuccessResponseType> {
    try {
      const shippingZones = await getShippingZonesHandler(pagination, token);
      return prepareSuccessResponse(shippingZones);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  /**
   * @description --this method updates shipping method price in saleor
   * @precondition -- you need to provide a token that has MANAGE_SHIPPING permission || you need to provide valid numerical price with existing channel
   * @post_condition -- this updates shipping channel listing and returns shipping method new information
   */
  public async updateShippingMethodPrice(
    updateShippingMethodPriceInput: UpdateShippingMethodPriceDto,
    token: string,
  ): Promise<SuccessResponseType> {
    try {
      this.logger.log(
        'Updating shipping method price',
        updateShippingMethodPriceInput,
      );
      const updateShippingMethodPrice = await updateShippingMethodPriceHandler(
        updateShippingMethodPriceInput,
        token,
      );
      return prepareSuccessResponse(updateShippingMethodPrice);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async getShippingMethodsV2(
    filter: GetShippingMethodsV2Dto,
    token: string,
  ): Promise<object> {
    try {
      const marketplaceShippingMethods = await getMarketplaceShippingMethods(
        filter.userEmail,
        token,
      );
      return prepareSuccessResponse(
        marketplaceShippingMethodsMap(marketplaceShippingMethods),
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async addShippingAddressForUser(
    shippingAddressInput: AddUserShippingAddressDto,
    token: string,
  ): Promise<object> {
    try {
      const checkoutIds = ['123'];
      const response = checkoutIds.map(async (checkoutId) => {
        return await shippingAddressUpdateHandler(
          checkoutId,
          shippingAddressInput.addressDetails,
          token,
        );
      });
      return prepareSuccessResponse(
        response,
        'Shipping address added against all user cart sessions',
        201,
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  public async addBillingAddressForUser(
    shippingAddressInput: AddUserShippingAddressDto,
    token: string,
  ): Promise<object> {
    try {
      const checkoutIds = ['123'];
      const response = checkoutIds.map(async (checkoutId) => {
        return await billingAddressUpdateHandler(
          checkoutId,
          shippingAddressInput.addressDetails,
          token,
        );
      });
      return prepareSuccessResponse(
        response,
        'Billing address added against all user cart sessions',
        201,
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }
}
