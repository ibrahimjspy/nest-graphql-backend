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
import {
  addCheckoutShippingMethod,
  marketplaceShippingMethodsMap,
} from './Shipping.utils';
import { MarketplaceCartService } from '../cart/services/marketplace/Cart.marketplace.service';
import {
  CheckoutShippingMethodType,
  MappedShippingMethodsType,
} from './Shipping.types';

@Injectable()
export class ShippingService {
  private readonly logger = new Logger(ShippingService.name);
  constructor(
    private readonly shippingPromotionService: ShippingPromotionService,
    private readonly paymentService: PaymentService,
    private readonly marketplaceService: MarketplaceCartService,
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

  /**
   * Retrieve shipping methods based on the provided filter and token.
   * @param {GetShippingMethodsV2Dto} filter - The filter criteria for retrieving shipping methods.
   * @param {string} token - The authentication token required for API calls.
   * @returns {Promise<object>} A promise that resolves to an object containing the shipping methods.
   */
  public async getShippingMethodsV2(
    filter: GetShippingMethodsV2Dto,
    token: string,
  ): Promise<object> {
    try {
      // Retrieve shipping zones with a limit of 1 from the API using the provided token.
      const shippingZones = await getShippingZonesHandler({ first: 1 }, token);

      // Get marketplace shipping methods based on the provided user email and token.
      const marketplaceShippingMethods = await getMarketplaceShippingMethods(
        filter.userEmail,
        token,
      );

      // Map and prepare the shipping methods data using the marketplaceShippingMethodsMap function.
      const mappedShippingMethods = marketplaceShippingMethodsMap(
        marketplaceShippingMethods,
        shippingZones['edges'][0].node.shippingMethods,
      );

      const checkoutIds = mappedShippingMethods.map(
        (method) => method.checkoutId,
      );

      const checkoutShippingMethods = (await Promise.all(
        checkoutIds.map(async (id) => {
          return await this.getShippingMethods({ checkoutId: id }, token);
        }),
      )) as CheckoutShippingMethodType[];

      const validateCheckoutShippingMethods = addCheckoutShippingMethod(
        mappedShippingMethods,
        checkoutShippingMethods,
      );
      this.selectDefaultShippingMethods(validateCheckoutShippingMethods, token);
      // Prepare a success response containing the mapped shipping methods.
      return prepareSuccessResponse(validateCheckoutShippingMethods);
    } catch (error) {
      this.logger.error(error);
      // Return an exception response in case of errors.
      return graphqlExceptionHandler(error);
    }
  }

  /**
   * Add a shipping address for the user to all marketplace cart sessions.
   * @param {AddUserShippingAddressDto} shippingAddressInput - The shipping address input data.
   * @param {string} token - The authentication token required for API calls.
   * @returns {Promise<object>} A promise that resolves to an object containing the response data.
   */
  public async addShippingAddressForUser(
    shippingAddressInput: AddUserShippingAddressDto,
    token: string,
  ): Promise<object> {
    try {
      this.logger.log('Adding shipping address against a user');
      // Retrieve all marketplace cart session IDs associated with the user's email.
      const checkoutIds =
        await this.marketplaceService.getMarketplaceCheckoutIds(
          shippingAddressInput.userEmail,
          token,
        );

      // Use 'Promise.all' to execute 'shippingAddressUpdateHandler' for all checkout IDs concurrently.
      const response = await Promise.all(
        checkoutIds.map(async (checkoutId) => {
          return await shippingAddressUpdateHandler(
            checkoutId,
            shippingAddressInput.addressDetails,
            token,
          );
        }),
      );

      // Prepare a success response with the response data.
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

  /**
   * Add a billing address for the user to all marketplace cart sessions.
   * @param {AddUserShippingAddressDto} shippingAddressInput - The billing address input data.
   * @param {string} token - The authentication token required for API calls.
   * @returns {Promise<object>} A promise that resolves to an object containing the response data.
   */
  public async addBillingAddressForUser(
    shippingAddressInput: AddUserShippingAddressDto,
    token: string,
  ): Promise<object> {
    try {
      // Retrieve all marketplace cart session IDs associated with the user's email.
      const checkoutIds =
        await this.marketplaceService.getMarketplaceCheckoutIds(
          shippingAddressInput.userEmail,
          token,
        );

      // Use 'Promise.all' to execute 'billingAddressUpdateHandler' for all checkout IDs concurrently.
      const response = await Promise.all(
        checkoutIds.map(async (checkoutId) => {
          return await billingAddressUpdateHandler(
            checkoutId,
            shippingAddressInput.addressDetails,
            token,
          );
        }),
      );

      // Prepare a success response with the response data.
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

  /**
   * Selects default shipping methods for each mapped checkout ID and returns the results.
   *
   * @param {MappedShippingMethodsType[]} mappedShippingMethods - Array of mapped shipping methods.
   * @param {Logger} logger - Logger instance for logging errors.
   * @returns {Promise<object[]>} An array of promises representing the results of shipping method selection.
   */
  protected async selectDefaultShippingMethods(
    mappedShippingMethods: MappedShippingMethodsType[],
    token: string,
  ): Promise<object[]> {
    try {
      this.logger.log(
        ' selecting default shipping methods',
        mappedShippingMethods,
      );
      const promises = mappedShippingMethods.map((mapping) => {
        return this.selectShippingMethods(
          mapping.checkoutId,
          mapping.shippingMethods[0].shippingMethodId,
          token,
        );
      });

      return await Promise.allSettled(promises);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }
}
