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
import { deleteCheckoutBundlesHandler } from 'src/graphql/handlers/checkout/cart/cart.marketplace';
import { getTargetBundleByCheckoutBundleId } from '../../Cart.utils';

@Injectable()
export class MarketplaceCartService {
  private readonly logger = new Logger(MarketplaceCartService.name);

  /**
   * @description -- fetches shopping cart data from bundle service against userEmail
   */
  public async getAllCheckoutBundles(
    userEmail: string,
    token: string,
    productDetails = true,
  ): Promise<object> {
    try {
      const checkoutData = await getCheckoutBundlesHandler(
        userEmail,
        token,
        productDetails,
      );
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
  ) {
    const marketplaceCheckout = await this.getAllCheckoutBundles(
      userEmail,
      token,
      false,
    );
    const checkoutId = marketplaceCheckout['data']['checkoutId'];
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
  ) {
    return await addCheckoutBundlesHandler(userEmail, checkoutBundles, token);
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
  ): Promise<object> {
    return await deleteCheckoutBundlesHandler(
      checkoutBundleIds,
      userEmail,
      false,
      token,
    );
  }

  /**
   * @description -- this method updates state of given list of checkout bundles
   * @satisfies -- it updates status in form of ~~ selected -- unselected
   */
  public async updateCheckoutBundleState(
    updateBundleState: UpdateBundleStateDto,
    token: string,
  ) {
    try {
      const response = await updateCheckoutBundleState(
        updateBundleState,
        token,
      );
      return prepareSuccessResponse(response, '', 200);
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
}
