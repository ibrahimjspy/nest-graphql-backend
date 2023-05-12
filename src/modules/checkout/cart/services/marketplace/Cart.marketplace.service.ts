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
import { UpdateBundleStateDto } from 'src/modules/checkout/dto/add-bundle.dto';
import {
  deleteCheckoutBundlesHandler,
  getCartV2Handler,
} from 'src/graphql/handlers/checkout/cart/cart.marketplace';
import { getTargetBundleByCheckoutBundleId } from '../../Cart.utils';
import { CheckoutIdError } from 'src/modules/checkout/Checkout.errors';
import { CheckoutBundlesDto } from 'src/graphql/types/checkout.type';

@Injectable()
export class MarketplaceCartService {
  private readonly logger = new Logger(MarketplaceCartService.name);

  /**
   * @description -- fetches shopping cart data from bundle service against userEmail
   */
  public async getAllCheckoutBundles({
    userEmail,
    token,
    checkoutId,
    productDetails = true,
    isSelected = null,
  }: CheckoutBundlesDto): Promise<object> {
    try {
      const checkoutData = await getCheckoutBundlesHandler({
        userEmail,
        checkoutId,
        token,
        productDetails,
        isSelected,
      });
      return prepareSuccessResponse(checkoutData);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
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
    const checkoutId = marketplaceCheckout['data']['checkoutId'];
    if (!checkoutId && throwException) {
      throw new CheckoutIdError(userEmail);
    }
    // TODO replace this with get bundles by checkout bundles id
    const checkoutBundlesData = getTargetBundleByCheckoutBundleId(
      marketplaceCheckout['data']['checkoutBundles'],
      checkoutBundleIds,
    );
    return { checkoutId, checkoutBundlesData };
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
  ) {
    try {
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
    token: string,
    checkoutId: string,
  ) {
    try {
      const response = await updateCartBundlesCheckoutIdHandler(
        userEmail,
        token,
        checkoutId,
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
    checkoutId,
    token,
    isSelected = null,
  }: CheckoutBundlesDto): Promise<object> {
    try {
      const checkoutData = await getCartV2Handler(
        checkoutId,
        token,
        isSelected,
      );
      return prepareSuccessResponse(checkoutData);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }
}
