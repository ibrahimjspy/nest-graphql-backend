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

@Injectable()
export class MarketplaceCheckoutService {
  private readonly logger = new Logger(MarketplaceCheckoutService.name);

  /**
   * @description -- fetches shopping cart data from bundle service against userEmail
   */
  public async getCheckoutBundles(
    userEmail: string,
    token: string,
  ): Promise<object> {
    try {
      const checkoutData = await getCheckoutBundlesHandler(userEmail, token);
      return prepareSuccessResponse(checkoutData);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  /**
   * @description -- this method adds bundles against checkout
   */
  public async addBundles(
    userEmail: string,
    checkoutBundles: CheckoutBundleInputType[],
    token: string,
  ) {
    try {
      const response = await addCheckoutBundlesHandler(
        userEmail,
        checkoutBundles,
        token,
      );
      return prepareSuccessResponse(response, '', 201);
    } catch (error) {
      this.logger.error(error);
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
      const response = await updateCheckoutBundlesHandler(
        userEmail,
        checkoutBundles,
        token,
      );

      return prepareSuccessResponse(response, '', 201);
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
    try {
      const response = await deleteCheckoutBundlesHandler(
        checkoutBundleIds,
        userEmail,
        false,
        token,
      );
      return prepareSuccessResponse(response, '', 201);
    } catch (error) {
      this.logger.error(error);
      return graphqlExceptionHandler(error);
    }
  }

  /**
   * @description -- this method adds checkout id against a user checkout bundle session made against a user email
   */
  public async updateCartBundlesCheckoutIdService(
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
}
