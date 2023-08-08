import { Injectable, Logger } from '@nestjs/common';
import { graphqlExceptionHandler } from 'src/core/proxies/graphqlHandler';
import { prepareSuccessResponse } from 'src/core/utils/response';
import {
  addCheckoutBundlesHandler,
  getCheckoutBundlesHandler,
  updateCartBundlesCheckoutIdHandler,
  updateCheckoutBundleState,
  updateCheckoutBundlesHandler,
} from 'src/graphql/handlers/checkout/checkout';
import { CheckoutBundleInputType } from 'src/graphql/handlers/checkout.type';
import {
  AddBundleDto,
  UpdateBundleStateDto,
} from 'src/modules/checkout/dto/add-bundle.dto';
import {
  addCheckoutBundlesV2Handler,
  deleteCheckoutBundlesHandler,
  getCartV2Handler,
  getCheckoutIdsHandler,
  replaceCheckoutBundleHandler,
} from 'src/graphql/handlers/checkout/cart/cart.marketplace';
import {
  getFlatFulfillmentCheckoutIds,
  getTargetBundleByCheckoutBundleId,
  isMultiCheckoutBundles,
} from '../../Cart.utils';
import {
  CheckoutIdError,
  NoCheckoutBundleFoundError,
} from 'src/modules/checkout/Checkout.errors';
import { CheckoutBundlesDto } from 'src/graphql/types/checkout.type';
import { MarketplaceBundlesType } from './Cart.marketplace.types';
import { checkoutBundlesInterface } from 'src/external/services/osPlaceOrder/Legacy.service.types';
import { ReplaceBundleDto } from '../../dto/cart';
import { isEmptyArray } from 'src/modules/product/Product.utils';
import {
  UpdateMarketplaceCheckoutIdType,
  UpdateMarketplaceCheckoutType,
} from '../../Cart.types';

@Injectable()
export class MarketplaceCartService {
  private readonly logger = new Logger(MarketplaceCartService.name);

  /**
   * @description -- fetches shopping cart data from bundle service against userEmail
   */
  public async getAllCheckoutBundles({
    userEmail,
    token,
    checkoutIds,
    productDetails = true,
    isSelected = null,
  }: CheckoutBundlesDto): Promise<object> {
    const checkoutData = await getCheckoutBundlesHandler({
      userEmail,
      checkoutIds,
      token,
      productDetails,
      isSelected,
    });
    return prepareSuccessResponse(checkoutData);
  }

  /**
   * @description -- fetches shopping cart data from bundle service against userEmail
   */
  public async getCheckoutBundlesByIds(
    userEmail: string,
    checkoutBundleIds: string[],
    token: string,
    throwException = true,
  ) {
    const productDetails = false;
    const marketplaceCheckout = await this.getAllCheckoutBundles({
      userEmail,
      token,
      productDetails,
    });
    let checkoutId = marketplaceCheckout['data']['checkoutIds'];
    if (!checkoutId.length && throwException) {
      throw new CheckoutIdError(userEmail);
    }
    // TODO replace this with get bundles by checkout bundles id
    const checkoutBundlesData = getTargetBundleByCheckoutBundleId(
      marketplaceCheckout['data']['checkoutBundles'],
      checkoutBundleIds,
    ) as checkoutBundlesInterface[];
    const validateCheckoutBundles = isEmptyArray(checkoutBundlesData);
    checkoutId = checkoutBundlesData[0].checkoutId;
    const isMultiCheckout = isMultiCheckoutBundles(
      marketplaceCheckout['data']['checkoutBundles'],
    );
    if (!validateCheckoutBundles)
      throw new NoCheckoutBundleFoundError(checkoutBundleIds);

    return { checkoutId, checkoutBundlesData, isMultiCheckout };
  }

  /**
   * @description -- this method adds bundles against checkout
   * @warn - this method throws an error caught by graphql handler - so make sure to wrap it around in try catch
   */
  public async addBundles(
    userEmail: string,
    checkoutBundles: CheckoutBundleInputType[],
    token: string,
    throwException = true,
  ): Promise<UpdateMarketplaceCheckoutType> {
    try {
      this.logger.log('Adding checkout bundles', checkoutBundles);

      return await addCheckoutBundlesHandler(userEmail, checkoutBundles, token);
    } catch (error) {
      this.logger.error(error);
      if (throwException) {
        throw error;
      }
      return graphqlExceptionHandler(error);
    }
  }

  /**
   * @description -- updates bundle quantity in cart against a user email
   */
  public async updateBundles(
    userEmail: string,
    checkoutBundles,
    token: string,
  ): Promise<object> {
    try {
      this.logger.log('Updating checkout bundles', checkoutBundles);

      return await updateCheckoutBundlesHandler(
        userEmail,
        checkoutBundles,
        token,
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  /**
   * @description -- removes given bundles from cart against a user email
   */
  public async deleteBundles(
    userEmail: string,
    checkoutBundleIds: string[],
    token: string,
    throwException = true,
  ): Promise<object> {
    try {
      this.logger.log('Deleting checkout bundles', checkoutBundleIds);

      return await deleteCheckoutBundlesHandler(
        checkoutBundleIds,
        userEmail,
        false,
        token,
      );
    } catch (error) {
      this.logger.error(error);
      if (throwException) {
        throw error;
      }
      return graphqlExceptionHandler(error);
    }
  }

  /**
   * @description -- this method updates state of given list of checkout bundles
   * @satisfies -- it updates status in form of ~~ selected -- unselected
   */
  public async updateCheckoutBundleState(
    action: boolean,
    updateBundleState: UpdateBundleStateDto,
    token: string,
  ) {
    try {
      this.logger.log(
        'Updating checkout bundles state',
        updateBundleState.checkoutBundleIds,
      );

      const response = await updateCheckoutBundleState(
        action,
        updateBundleState,
        token,
      );
      return prepareSuccessResponse(
        response,
        'checkout bundle state updated',
        201,
      );
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  /**
   * @description -- this method adds checkout id against a user checkout bundle session made against a user email
   */
  public async addCheckoutIdToMarketplace(
    userEmail: string,
    updateMarketplaceCheckoutIdInput: UpdateMarketplaceCheckoutIdType[],
    token: string,
  ) {
    try {
      this.logger.log(
        'Adding checkout id to marketplace',
        updateMarketplaceCheckoutIdInput,
      );

      const response = await updateCartBundlesCheckoutIdHandler(
        userEmail,
        updateMarketplaceCheckoutIdInput,
        token,
      );

      return response;
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  /**
   * @description -- fetches shopping cart data from bundle service against checkoutId
   */
  public async getCheckoutBundlesV2({
    checkoutIds,
    token,
    isSelected = null,
  }: CheckoutBundlesDto): Promise<object> {
    try {
      const checkoutData = await getCartV2Handler(
        checkoutIds[0],
        token,
        isSelected,
      );
      return prepareSuccessResponse(checkoutData);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  /**
   * @description -- add bundles to cart against a checkout id and email
   */
  public async addCheckoutBundlesV2(
    checkoutBundles: AddBundleDto,
    token: string,
  ): Promise<MarketplaceBundlesType> {
    try {
      this.logger.log(
        'Adding checkout bundles to cart',
        checkoutBundles.bundles,
      );

      const addCheckoutBundles = await addCheckoutBundlesV2Handler(
        checkoutBundles,
        token,
      );
      return addCheckoutBundles;
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  /**
   * @description -- this replaces checkout bundle with given bundle id
   */
  public async replaceCheckoutBundle(
    replaceBundleInput: ReplaceBundleDto,
    token: string,
  ): Promise<object> {
    this.logger.log(
      'Replacing checkout bundles in marketplace',
      replaceBundleInput.checkoutBundleId,
    );
    const replaceCheckoutBundles = await replaceCheckoutBundleHandler(
      replaceBundleInput,
      token,
    );
    return replaceCheckoutBundles;
  }

  /**
   * Get marketplace checkout IDs associated with the given user email.
   * @param {string} userEmail - The email of the user to retrieve checkout IDs.
   * @param {string} token - The authentication token required for API calls.
   * @returns {Promise<string[]>} A promise that resolves to an array containing checkout IDs.
   */
  public async getMarketplaceCheckoutIds(
    userEmail: string,
    token: string,
  ): Promise<string[]> {
    try {
      this.logger.log('Fetching checkout IDs from marketplace');

      // Use the 'getCheckoutIdsHandler' function to retrieve checkout IDs from the marketplace API.
      const checkoutIds = await getCheckoutIdsHandler(userEmail, token);

      // Return the array of checkout IDs.
      return checkoutIds;
    } catch (error) {
      // Log any errors that occur during the process.
      this.logger.error(error);

      // Return an exception response in case of errors.
      throw error;
    }
  }

  /**
   * Get checkout IDs associated with flat fulfillment for the given user email.
   * @param {string} userEmail - The email of the user to retrieve flat fulfillment checkout IDs.
   * @param {string} token - The authentication token required for API calls.
   * @returns {Promise<string[]>} A promise that resolves to an array containing flat fulfillment checkout IDs.
   */
  public async getFlatFulfillmentCheckoutIds(
    userEmail: string,
    token: string,
  ): Promise<string[]> {
    try {
      this.logger.log('Fetching checkout IDs from marketplace');

      // Use 'getAllCheckoutBundles' function to retrieve all checkout bundles for the user.
      const checkout = await this.getAllCheckoutBundles({
        userEmail,
        token,
        throwException: true,
      });

      // Get flat fulfillment checkout IDs from the retrieved checkout bundles.
      const flatFulfillmentCheckoutIds = getFlatFulfillmentCheckoutIds(
        checkout['data']['checkoutBundles'],
      );

      // Return the array of flat fulfillment checkout IDs.
      return flatFulfillmentCheckoutIds;
    } catch (error) {
      // Log any errors that occur during the process.
      this.logger.error(error);

      // Return an exception response in case of errors.
      throw error;
    }
  }
}
